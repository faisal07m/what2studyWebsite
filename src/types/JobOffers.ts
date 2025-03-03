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
  bubbleIcon:["http://digitaledulab.de/what2study/parse/files/what2study/e9f7349a9e7537ada6b04636657615e8_bild.png", "http://digitaledulab.de/what2study/parse/files/what2study/a9e4eac427d99e8bd49ccd2a377019f2_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/f44f27a5292bd1dbe89e9ca0ff465809_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/90a2a45cb264befbad3c9e61d18858a8_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/0c85e947f4e2dad6bdb9a336c488b57f_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/48fc7aac4f3c3929d9788ed53ec39ff3_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/c88d026190eafcd1dcc6392139219a1a_bild.png"],
  AudioNarration:true,
  Narrator:"male",
  profileImage:["http://digitaledulab.de/what2study/parse/files/what2study/135a1da9a278b80afe2c74cd1003becd_bild.png", "http://digitaledulab.de/what2study/parse/files/what2study/c44f70c1b439449456fa3b54b9cc0d87_bild.png", "http://digitaledulab.de/what2study/parse/files/what2study/fa69c8fa912574ed8c5d68f3a414a943_bild.png", "http://digitaledulab.de/what2study/parse/files/what2study/ca1d3978eda6281e06a5e0d7a8c64a4a_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/ad326af1a82c82ff179f190ad2f4b5ad_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/d5a0aa213de27d87fc69feb69b59b62c_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/db300e7de3e1782f59904faaf6d3f60e_bild.png","http://digitaledulab.de/what2study/parse/files/what2study/788dcd151b635fe856af5cef707403e7_bild.png"],
  introVideo:"",
  selectedBubbleIcon:"http://digitaledulab.de/what2study/parse/files/what2study/e9f7349a9e7537ada6b04636657615e8_bild.png",
  selectedProfileImage:"http://digitaledulab.de/what2study/parse/files/what2study/135a1da9a278b80afe2c74cd1003becd_bild.png",
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
