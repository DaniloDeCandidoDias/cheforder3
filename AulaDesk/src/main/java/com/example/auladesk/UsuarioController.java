package com.example.auladesk;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import static com.example.auladesk.LoginController.showMenssage;

public class UsuarioController {


    @FXML
    private TextField txtNome;

    @FXML
    private TextField txtEmail;

    @FXML
    private PasswordField txtSenha;

    @FXML
    private TextField txtCpf;

    @FXML
    private TextField txtCep;

    @FXML
    private TextField txtLogradouro;

    @FXML
    private TextField txtNumero;

    @FXML
    private TextField txtBairro;

    @FXML
    private TextField txtCidade;

    @FXML
    private TextField txtUf;

    @FXML
    private TextField txtComplemento;

    @FXML
    private void onVoltarButtonClick(ActionEvent event) throws IOException {

        FXMLLoader loader = new FXMLLoader(getClass().getResource("menu-view.fxml"));
        Scene scene = new Scene(loader.load());
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.setScene(scene);
    }

    @FXML
    private void onSalvarButtonClick(ActionEvent event)  throws IOException{


        URL url = new URL("http://localhost:8080/usuarios/adm");

        HttpURLConnection conn =(HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-type","application/json");

        conn.setDoOutput(true);

        String json = "{\n" +
                "  \"nome\": "+formatarCampoJson(txtNome.getText())+",\n" +
                "  \"email\": "+formatarCampoJson(txtEmail.getText())+",\n" +
                "  \"cpf\": "+formatarCampoJson(txtCpf.getText())+",\n" +
                "  \"cep\": "+formatarCampoJson(txtCep.getText())+",\n" +
                "  \"logradouro\": "+formatarCampoJson(txtLogradouro.getText())+",\n" +
                "  \"numero\": "+formatarCampoJson(txtNumero.getText())+",\n" +
                "  \"bairro\": "+formatarCampoJson(txtBairro.getText())+",\n" +
                "  \"cidade\": "+formatarCampoJson(txtCidade.getText())+",\n" +
                "  \"estado\": "+formatarCampoJson(txtUf.getText())+",\n" +
                "  \"complemento\": "+formatarCampoJson(txtComplemento.getText())+",\n" +
                "  \"secretKey\": \"vvg47dg8szer7ghs9v8a7g98ae\",\n" +
                "  \"senha\": "+formatarCampoJson(txtSenha.getText())+"\n" +
                "}";

        try(OutputStream os = conn.getOutputStream()){
            os.write(json.getBytes());
        }

        var code = conn.getResponseCode();
        if (code ==200){

            showMenssage("Restaurante salvo com sucesso! ", Alert.AlertType.INFORMATION);

            FXMLLoader loader = new FXMLLoader(getClass().getResource("menu-view.fxml"));
            Scene scene = new Scene(loader.load());
            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.setScene(scene);

        }else {
            showMenssage("Erro ao salvar restaurante! ", Alert.AlertType.ERROR);
        }

        conn.disconnect();

    }

    @FXML
    private void onBuscarCepButtonClick(ActionEvent event) throws IOException {
        String cep = txtCep.getText().replaceAll("[^0-9]", "");
        if (cep.isBlank()) {
            showMenssage("Informe um CEP valido.", Alert.AlertType.ERROR);
            return;
        }

        URL url = new URL("http://localhost:8080/api/enderecos/" + cep);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");

        var code = conn.getResponseCode();
        if (code == 200) {
            try (InputStream inputStream = conn.getInputStream()) {
                String json = new String(inputStream.readAllBytes());
                txtLogradouro.setText(getJsonValue(json, "logradouro"));
                txtBairro.setText(getJsonValue(json, "bairro"));
                txtCidade.setText(getJsonValue(json, "cidade"));
                txtUf.setText(getJsonValue(json, "uf"));
            }
        } else {
            showMenssage("CEP nao encontrado.", Alert.AlertType.ERROR);
        }

        conn.disconnect();
    }

    private static String getJsonValue(String json, String key) {
        String search = "\"" + key + "\"";
        int index = json.indexOf(search);
        if (index < 0) {
            return "";
        }

        int valueStart = json.indexOf(':', index) + 1;
        while (valueStart < json.length() && Character.isWhitespace(json.charAt(valueStart))) {
            valueStart++;
        }

        if (valueStart >= json.length()) {
            return "";
        }

        char firstChar = json.charAt(valueStart);
        if (firstChar == '"') {
            int start = valueStart + 1;
            int end = json.indexOf('"', start);
            if (end < 0) {
                return "";
            }
            return json.substring(start, end);
        }

        int end = valueStart;
        while (end < json.length() && json.charAt(end) != ',' && json.charAt(end) != '}') {
            end++;
        }

        return json.substring(valueStart, end).trim();
    }

    private static String formatarValorJson(String valor) {
        return valor == null ? "" : valor.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static String formatarCampoJson(String valor) {
        if (valor == null || valor.isBlank()) {
            return "null";
        }

        return "\"" + formatarValorJson(valor) + "\"";
    }
}
