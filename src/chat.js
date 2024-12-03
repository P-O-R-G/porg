// Prompts ChatGPT with the input string to `decode` it to English
var askChat = (async function(predictedChars) {


//String model = "gpt-3.5-turbo";
//String response_format = JSON ? "json_object" : "text";
//String body = "{\"model\": \"" + model + "\", \"response_format\": {\"type\": \"" + response_format + "\"}, \"messages\": [{\"role\": \"user\", \"content\": \"" + prompt + "\"}], \"max_tokens\": " + max_tokens + "}";
    
    // TODO: hide this
    const CHATGPT_TOKEN = ""

    // To be updated
    var prompt = 'Take this sequence of characters, which may include some repeated characters, some unknown characters (?), and some incorrect characters, and return just the English word or words being spelled. If you are unsure of the English word being spelled, return "UNKNOWN". The input string is: ' + predictedChars;

    // or 'gpt-4'
    var model = 'gpt-3.5-turbo';    

    // Arbitrary
    var max_tokens = 40;    

    // Put it all together
    var bodyObj = {
        model: model,
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        max_tokens: max_tokens,
        temperature: 0
    }

    try {
        var response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${CHATGPT_TOKEN}`
            },
            body: JSON.stringify(bodyObj)
        });

        // check to make sure the response is ok
        if (!response.ok) {
            console.error('HTTP error! Status: ${response.status}');
            return 'ERROR: ${response.status} - ${response.statusText}';
        }

        // parse the response JSON
        var responseData = await response.json();

        // extract and return the reply
        return responseData.choices[0].message.content || "ERROR: No response content."
    } catch(error) {
        console.error(error);
        return "ERROR: Failed to fetch data from OpenAI API."
    }
});

export default askChat;

