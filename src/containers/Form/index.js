// @ts-nocheck
import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

const Form = ({ onSuccess, onError }) => {
  // Initialisation des états avec useState
  const [sending, setSending] = useState(false); // Booléen pour savoir si le formulaire est en cours d'envoi
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    prenom: "",
    type: "",
    message: "",
  }); // Objet qui contient les valeurs des champs du formulaire

  // Fonction pour réinitialiser le formulaire après l'envoi
  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      type: "",
      message: "",
    });
  };

  const handleChange = (e) => {
    // Cas où e est un "fake event" avec target
    if (e && e.target && typeof e.target.name === "string") {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Fonction qui gère l'envoi du formulaire
  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de page)

      setSending(true); // On indique que le formulaire est en cours d'envoi
      try {
        await mockContactApi(); // Simulation d'un appel API
        setSending(false); // Arrête l'indicateur de "sending"
        onSuccess(); // Appelle la fonction de succès si définie
        resetForm(); // Réinitialise le formulaire après envoi
      } catch (err) {
        setSending(false); // Arrête l'indicateur de "sending"
        onError(err); // Appelle la fonction d'erreur si une erreur survient
      }
    },
    [onSuccess, onError]
  );

  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field
            placeholder=""
            label="Nom"
            name="nom"
            value={formData.nom} // Le nom est récupéré de formData
            onChange={handleChange} // handleChange est appelé quand l'utilisateur modifie ce champ
          />
          <Field
            placeholder=""
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
          />
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={handleChange}
            label="Personel / Entreprise"
            name="type"
            type="large"
            value={formData.type}
          />
          <Field
            placeholder=""
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            name="message"
            value={formData.message}
            type={FIELD_TYPES.TEXTAREA}
            onChange={handleChange}
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;
