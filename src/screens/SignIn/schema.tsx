import * as Yup from "yup";
import { ptForm } from "yup-locale-pt";
Yup.setLocale(ptForm);

export default Yup.object().shape({
    code: Yup.string().required("Digite o código"),
    password: Yup.string().required("Digite a senha")
});