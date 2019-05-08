import PubSub from 'pubsub-js';

export default class TratadorErros {

    publicaErros(jsonErros) {
        console.log("jsonErros:" + jsonErros);
        for (var i = 0; i < jsonErros.errors.length; i++) {
            var erro = jsonErros.errors[i];
            console.log(erro);
            PubSub.publish("erro-validacao", erro);
        }
    }
}