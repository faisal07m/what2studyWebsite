import moment from 'moment'
import Parse from 'parse'

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

  }
export const blankBlock:  Partial<JobOfferBlock> = {
  user:"",
  behavior:[{id:1, leftValue: "Locker", rightValue:"Professionell", pointOnScale:0, given:"Formalität"},{id:2, leftValue: "Meinungsstark", rightValue:"Neutral", pointOnScale:0, given:"Meinung"},{id:3, leftValue: "Viele Emojis", rightValue:"Keine Emojis", pointOnScale:0, given:"Emotionen"},{id:4, leftValue: "Lange Antworten", rightValue:"Kurze Antworten", pointOnScale:0, given:"Länge"},{id:5, leftValue: "Bezugnehmend", rightValue:"Vorschlagend", pointOnScale:0, given:"Themen"},{id:6, leftValue: "Humorvoll", rightValue:"Seriös", pointOnScale:0, given:"Umgangston"}],
  name: "",
  language: ""  ,
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
  talkToaHuman: "",
  randomQuestionEnabled: true,
  talkToaHumanEnabled: true,

  activeChatbot: false,
  scriptTag:""
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
    console.log(res)
    let formData = { user: curUser?.id , chatbotId:res.id}
    console.log(formData)

    const response = await fetch(
      "http://localhost:1339/what2study/parse/functions/scriptTag",
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
