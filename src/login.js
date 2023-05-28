const aws = require('aws-sdk')
const cognito = new aws.CognitoIdentityServiceProvider();
const { sendResponseMessage, validateSignupLogin } = require("./helper");

const login = async (event) => {
    try {

        const isValid = validateSignupLogin(event.body)
        if (!isValid){
            return sendResponseMessage(400, { message: 'Verifique os campos informados.' });
        }

        const body = JSON.parse(event.body);
        const { email, password } = body
        const { user_pool_id, client_id } = process.env
        const params = {
            AuthFlow: "ADMIN_NO_SRP_AUTH",
            UserPoolId: user_pool_id,
            ClientId: client_id,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        }
        const response = await cognito.adminInitiateAuth(params).promise();
        return sendResponseMessage(200, { message: 'Login efetuado com sucesso.', token: response.AuthenticationResult.IdToken });
    }
    catch (error) {
        const message = error.message ? error.message : 'Internal server error';
        return  sendResponseMessage(400, { message: message });
    }
}

module.exports = {
    handler:login
}
     