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

  textBoxColorChatbotReply: string
  fontColorChatbotReply: string
  fontstyleChatbotReply: string
  uiBackgroundGroupB: string
  uiHighLightGroupB:string
  
  randomQuestion?: string
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

  }
export const blankBlock:  Partial<JobOfferBlock> = {
  user:"",
  behavior:[{id:1, leftValue: "Locker", rightValue:"Professionell", pointOnScale:3, given:"Formalität"},{id:2, leftValue: "Meinungsstark", rightValue:"Neutral", pointOnScale:3, given:"Meinung"},{id:3, leftValue: "Viele Emojis", rightValue:"Keine Emojis", pointOnScale:3, given:"Emotionen"},{id:4, leftValue: "Lange Antworten", rightValue:"Kurze Antworten", pointOnScale:3, given:"Länge"},{id:5, leftValue: "Bezugnehmend", rightValue:"Vorschlagend", pointOnScale:3, given:"Themen"},{id:6, leftValue: "Humorvoll", rightValue:"Seriös", pointOnScale:3, given:"Umgangston"}],
  name: "",
  language: "de"  ,
  bubbleIcon:[],
  AudioNarration:true,
  Narrator:"male",
  profileImage:[],
  selectedBubbleIcon:"",
  selectedProfileImage:"",

  headerColor:"",
  headerIconFontColor:"",
  chatbotBackgroundColor:"",
  
  textBoxColorUser: "",
  fontColorUser: "",
  fontstyleUser: "",
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
  defaultPrompt: 'You are a helpful AI assistant. Use the following pieces of context to answer the question at the end. You should act as a study advisor. So students and people who are interested in studying will come to you with questions about their study programs.\nAnswer in German or English. You should help them. Nutze geschlechtssensible Sprache und gendere mit Gendersternchen (z. B. Student*innen, Dozent*innen).\nIf the question is not related to the context, please answer as best as possible from your role as a study advisor.',
  customPrompt:'You are a helpful AI assistant. Use the following pieces of context to answer the question at the end. You should act as a study advisor. So students and people who are interested in studying will come to you with questions about their study programs.\nAnswer in German or English. You should help them. Nutze geschlechtssensible Sprache und gendere mit Gendersternchen (z. B. Student*innen, Dozent*innen).\nIf the question is not related to the context, please answer as best as possible from your role as a study advisor.',
  welcomeMsgDE:'Hallo, ich bin ein Chatbot der dir bei deinem Studium helfen soll! Bevor wir loslegen, ein paar wichtige Fakten.',
  welcomeMsgEN:"Hello. It's nice to meet you! I am a chatbot built to help you with your studies! Before we get started, here are a few important facts.",
  introScreenInfoDE:'Geben Sie die erste Nachricht ein, die vom Chatbot angezeigt werden soll',
  introScreenInfoEN:'Welcome to the Student Advisory Service! How can I help you today?'
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
