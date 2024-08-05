#!/usr/bin/env node
const client = require('./redis_client')
const { Kafka } = require("kafkajs");


class DataService{
     constructor(){
        this.kafka = new Kafka({
            clientId: "node-producer",
            brokers: [
                "ec2-98-130-14-42.ap-south-2.compute.amazonaws.com:9092"
            ],
        });

        this.topicConsumer= this.kafka.consumer({ groupId: "group-1" });
        // this.admin = this.kafka.admin()
     }


     async activate_listener(){
       await client.connect()

       await this.topicConsumer.subscribe({topics:['sr1_velocity','sr2_velocity','sr1_position','sr2_position','sr1_battery','sr2_battery']})

   
       await this.topicConsumer.run({
           eachMessage:async({topic,partition,message})=>{
               const data = JSON.parse(message.value.toString())
               const stored = message.value.toString()
               switch (data['MessageType']) {
                   case 'position':
                       await client.set(`${data['RobotID']}_position`,stored)
                       break;
                   case 'battery':
                       await client.set(`${data['RobotID']}_battery`,stored)
                       break;
                   case 'velocity':
                       await client.set(`${data['RobotID']}_velocity`,stored)
                       break;       
                   default:
                       break;
               }
           }
       })
       
     }
}



let startService = new DataService()
startService.activate_listener()
