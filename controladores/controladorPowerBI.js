const connection = require('../config/bbdd')

const obtenerPowerBI = async (req, res) => {
    const tenantId = 'f8cdef31-a31e-4b4a-93e4-5f571e91255a';
    const clientId = 'your-client-id';
    const clientSecret = 'your-client-secret';
    const authorityUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    const requestBody = {
        client_id: clientId,
        scope: 'https://graph.microsoft.com/.default',
        client_secret: clientSecret,
        grant_type: 'client_credentials'
    };

    try {
        const tokenResponse = await axios.post(authorityUrl, qs.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        // Aquí podrías añadir más lógica para obtener datos específicos de Power BI
        // usando el accessToken, como listado de informes, etc.

        res.json({
            accessToken: accessToken,
            embedUrl: 'URL para incrustar el informe',
            reportId: 'ID del informe específico'
        });
    } catch (error) {
        console.error('Error fetching PowerBI token:', error);
        res.status(500).send('Failed to retrieve Power BI token');
    }
};

module.exports = {
    obtenerPowerBI
};
