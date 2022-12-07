

class MqttClient{

    dataLamps = null;
    topic = 'SolidRules/Machine/INTESIS_DALI/Status';
    hostname='wss://test.mosquitto.org:8081/ws';
    needToUpdate=false;
    

    options = {
        // Clean session
        clean: true,
        connectTimeout: 4000,
        protocol: "wss",
        // Authentication
        //useSSL: true,
        rejectUnauthorized: false,
    }

    constructor(){

        const client = mqtt.connect(this.hostname, this.options);

        client.on('connect', () => {
            console.log('Connected')
            client.subscribe([this.topic], () => {
                console.log(`Subscribe to topic '${this.topic}'`)
            })
        })
        
        client.on('message', (topic, payload) => {
            console.log('Received Message:', topic, payload.toString())
            this.dataLamps = JSON.parse(payload.toString());
            this.needToUpdate = true;
        })
    }

    getData(){
        return this.dataLamps;
    }

    getNeedToUpdate(){
        return this.needToUpdate;
    }

    setNeedToUpdate(needToUpdate){
        this.needToUpdate=needToUpdate;
    }

}

export {MqttClient};