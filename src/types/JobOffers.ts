import moment from 'moment'
import Parse from 'parse'
import { SERVER_URL, SERVER_URL_parsefunctions } from '../config/parse'

export type JobOfferBlock = {
  id: string
  user:string
  name: string
  language: string  
  bubbleIcon?:string[]
  selectedBubbleIcon:string
  selectedProfileImage:string

  introVideo:string
  AudioNarration:boolean
  Narrator:string
  behavior:[{id:number, leftValue: string, rightValue:string, pointOnScale:number, given:string},{id:number, leftValue: string, rightValue:string, pointOnScale:number,given:string},{id:number, leftValue: string, rightValue:string, pointOnScale:number,given:string},{id:number, leftValue: string, rightValue:string, pointOnScale:number,given:string},{id:number, leftValue: string, rightValue:string, pointOnScale:number,given:string},{id:number, leftValue: string, rightValue:string, pointOnScale:number,given:string}]
  profileImage?:string[]

  headerColor:string
  headerIconFontColor:string
  chatbotBackgroundColor:string
  
  textBoxColorUser: string
  fontColorUser: string
  fontstyleUser: string
  uiBackgroundGroupA: string
  uiHighLightGroupA:string
  langWeiterMain:string

  textBoxColorChatbotReply: string
  fontColorChatbotReply: string
  fontstyleChatbotReply: string
  uiBackgroundGroupB: string
  uiHighLightGroupB:string

  fontstyle:string
  
  randomQuestion?: string
  randomQuestionTimer:string
  talkToaHuman?: string
  randomQuestionEnabled: boolean
  talkToaHumanEnabled?: boolean

  activeChatbot: boolean
  scriptTag:string

  matriculationNumber:boolean

  defaultPrompt:string
  customPrompt:string

  welcomeMsgDE: string
  introScreenInfoDE:string

  welcomeMsgEN: string
  introScreenInfoEN:string
  promptSelection:boolean
  backgroundColor:string



  }
export const blankBlock:  Partial<JobOfferBlock> = {
  user:"",
  behavior:[{id:1, leftValue: "Locker", rightValue:"Professionell", pointOnScale:4, given:"Formalität"},{id:2, leftValue: "Meinungsstark", rightValue:"Neutral", pointOnScale:2, given:"Meinung"},{id:3, leftValue: "Viele Emojis", rightValue:"Keine Emojis", pointOnScale:2, given:"Emotionen"},{id:4, leftValue: "Lange Antworten", rightValue:"Kurze Antworten", pointOnScale:2, given:"Länge"},{id:5, leftValue: "Bezugnehmend", rightValue:"Vorschlagend", pointOnScale:3, given:"Themen"},{id:6, leftValue: "Humorvoll", rightValue:"Seriös", pointOnScale:3, given:"Umgangston"}],
  name: "",
  language: "de"  ,
  bubbleIcon:["http://digitaledulab.de/what2study/parse/files/what2study/dd4f02623c6394d1a4834c41a527f6fe_bild.png", "http://digitaledulab.de/what2study/parse/files/what2study/bc9ec1d7c1a6875c776a319340cdfd7f_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/be69286f000e0f3786a91c8266b5bb83_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/a01093390684aebbfbf819a7699e17b3_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/4461c6efdc62290b66392d961c1b07b9_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/34c7715e2ff41acff5ee301283f4bcd0_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/3d0ac7bfff615a9cb50b6b950646eb47_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/d3de22a24a2ff9e8c70525b0803b28d9_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/844666d8f2f90919084c865cd0a305dc_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/b62465d4db98305e9eb00a04b7665a14_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/a0fa32c9127810682c8e45a40a845eac_bild.png"],
  AudioNarration:true,
  Narrator:"male",
  profileImage:["http://digitaledulab.de/what2study/parse/files/what2study/4588066f8fa48d5686bfae2cbcaa308f_bild.png", "http://digitaledulab.de/what2study/parse/files/what2study/3c8f1f0a7cc094b31e474fa9ce450093_bild.png", "http://digitaledulab.de/what2study/parse/files/what2study/5bce52bdcbab1d93442059b571e3a306_bild.png", "http://digitaledulab.de/what2study/parse/files/what2study/547c1d41ada803e39f7b69c27d6d4e5e_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/fd27414756038373a0e161736d1e7da7_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/d5a0aa213de27d87fc69feb69b59b62c_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/d90ebe298aae47e3f72b4e2aa85e4083_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/d3de22a24a2ff9e8c70525b0803b28d9_bild.png"],
  introVideo:"",
  selectedBubbleIcon:"http://digitaledulab.de/what2study/parse/files/what2study/dd4f02623c6394d1a4834c41a527f6fe_bild.png",
  selectedProfileImage:"http://digitaledulab.de/what2study/parse/files/what2study/4588066f8fa48d5686bfae2cbcaa308f_bild.png",
  langWeiterMain:"",

  headerColor:"",
  headerIconFontColor:"",
  chatbotBackgroundColor:"",
  randomQuestionTimer:"120000",
  
  textBoxColorUser: "",
  fontColorUser: "",
  fontstyleUser: "",
  fontstyle:"",
  uiBackgroundGroupA: "",
  uiHighLightGroupA:"",

  textBoxColorChatbotReply: "",
  fontColorChatbotReply: "",
  fontstyleChatbotReply: "",
  uiBackgroundGroupB: "",
  uiHighLightGroupB:"",
  
  randomQuestion: "",
  talkToaHuman: "Wir freuen uns, dass Sie direkt mit uns in Kontakt treten möchten, gerne können Sie hierzu die angegebenen Optionen nutzen. \n\nBitte beachten Sie unsere Öffnungszeiten und gewähren Sie uns nach Möglichkeit Einblick in Ihren Chatverlauf, damit wir direkt sehen können, um welches Problem es sich handelt. Sollte gerade niemand verfügbar sein können wir uns auch auf Wunsch bei Ihnen melden.",
  randomQuestionEnabled: true,
  talkToaHumanEnabled: true,
  matriculationNumber:true,


  activeChatbot: false,
  scriptTag:"",
  promptSelection: false,
  defaultPrompt: 'You are a helpful AI assistant with the name: "chatbotname", responsible for answering questions about the "universityname". Use the provided context to answer the questions. Your role is to act as a study advisor, assisting students and those interested in study programs with their inquiries. Please use gender-sensitive language (e.g., Studierende, Dozierende).\n\nImportant Guidelines:\n\nAccuracy: If the exact study program mentioned by the student (e.g., architecture, HCI) is not offered by the university, do not state that it is. Instead, mention similar or related programs, if available, and offer to provide more information.\n\nClarification: If you are unsure about the question or if the provided context does not have enough information, do not make assumptions. Ask the user for more specific details to better understand their needs.\n\nSensitive Topics: Do not engage in answering questions related to sensitive topics such as racism or discrimination. Instead, respond with something like,  I\'m sorry to hear that you are experiencing this type of problem. Unfortunately, I cannot help you directly with this kind of problem. Please check "Guideline/Page"\n\nStudy-Related Focus: Answer only questions that are related to study programs, universities, education, or opening hours / holidays of the university. Redirect conversations back to study-related topics if necessary.\n\nData Processing: If a user asks how their data or chat history is processed, provide a brief summary of the data protection policy and refer them to the full policy. Respond with something like What2Study verarbeitet deine personenbezogenen Daten, um dir bei Fragen rund um das Studium zu helfen und unsere Dienstleistungen zu verbessern. Details zur Datenverarbeitung findest du in unserer Datenschutzerklärung: [https://digitaledulab.de/what2study/datasecurity/] \nResponse Structure: Clearly state if a program is not available and suggest similar options. Always ask a follow-up question to ensure the user\'s needs are met.',
  customPrompt:'You are a helpful AI assistant with the name: "chatbotname", responsible for answering questions about the "universityname". Use the provided context to answer the questions. Your role is to act as a study advisor, assisting students and those interested in study programs with their inquiries. Please use gender-sensitive language (e.g., Studierende, Dozierende).\n\nImportant Guidelines:\n\nAccuracy: If the exact study program mentioned by the student (e.g., architecture, HCI) is not offered by the university, do not state that it is. Instead, mention similar or related programs, if available, and offer to provide more information.\n\nClarification: If you are unsure about the question or if the provided context does not have enough information, do not make assumptions. Ask the user for more specific details to better understand their needs.\n\nSensitive Topics: Do not engage in answering questions related to sensitive topics such as racism or discrimination. Instead, respond with something like,  I\'m sorry to hear that you are experiencing this type of problem. Unfortunately, I cannot help you directly with this kind of problem. Please check "Guideline/Page"\n\nStudy-Related Focus: Answer only questions that are related to study programs, universities, education, or opening hours / holidays of the university. Redirect conversations back to study-related topics if necessary.\n\nData Processing: If a user asks how their data or chat history is processed, provide a brief summary of the data protection policy and refer them to the full policy. Respond with something like What2Study verarbeitet deine personenbezogenen Daten, um dir bei Fragen rund um das Studium zu helfen und unsere Dienstleistungen zu verbessern. Details zur Datenverarbeitung findest du in unserer Datenschutzerklärung: [https://digitaledulab.de/what2study/datasecurity/] \nResponse Structure: Clearly state if a program is not available and suggest similar options. Always ask a follow-up question to ensure the user\'s needs are met.',
  welcomeMsgDE:'Hallo, ich bin ein Chatbot der dir bei deinem Studium helfen soll! Bevor wir loslegen, ein paar wichtige Fakten.',
  welcomeMsgEN:"Hello. It's nice to meet you! I am a chatbot built to help you with your studies! Before we get started, here are a few important facts.",
  introScreenInfoDE:'Geben Sie die erste Nachricht ein, die vom Chatbot angezeigt werden soll',
  introScreenInfoEN:'Welcome to the Student Advisory Service! How can I help you today?',
  backgroundColor:""
}


export const chatbots = Parse.Object.extend('chatbots')

export const generateJobs = async (
  
  props: Partial<JobOfferBlock>
): Promise<string> => {
  const curUser = Parse.User.current()
  let initValues = { ...blankBlock, ...props }
  const job = new chatbots()
  try {
    const res = await job.save(initValues)
    let formData = { user: curUser?.id , chatbotId:res.id}
    const response = await fetch(
      SERVER_URL_parsefunctions+"/scriptTag",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Parse-Application-Id": "what2study",
          "X-Parse-Master-Key": "what2studyMaster",
        },
        body: JSON.stringify(formData),
      }
      
    );
    const data = await response.json();
    console.log(data)
    console.log(data.result.scriptTag)

    return res.id
  } catch (error) {
    return 'error'
  }

 


}

// export function generateQuestBlock(props: Partial<QuestBlockProps>) {
//   return { ...blankBlock, ...props }
// }

export const getJobs = async (id: string) => {
  const query = new Parse.Query(chatbots)
  try {
    const job = await query.get(id)
    return job.attributes
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getActiveChatbotID = async () => {
  const curUser = Parse.User.current()
  const query = new Parse.Query(chatbots)
  query.equalTo("activeChatbot", true)
  query.equalTo("user", curUser?.id)
  
  try {
    const activeID = await query.first()
    console.log("id checking")
    console.log(activeID)
    return activeID?.id
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getScriptTag = async () => {
  const curUser = Parse.User.current()
  const query = new Parse.Query(chatbots)
  query.equalTo("activeChatbot", true)
  query.equalTo("user", curUser?.id)
  
  try {
    const activeID = await query.first()
    return activeID?.attributes.scriptTag
  } catch (error) {
    console.log(error)
    return error
  }
}
