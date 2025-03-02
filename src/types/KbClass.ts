import moment from 'moment'
import Parse from 'parse'


export type KbClass = {
  id: string
  user:string
  name: string
  kbid:string[]
  chatbots:string[]

  }

export const blankBlock:  Partial<KbClass> = {
  user:"",
  name: "",
  kbid:[],
  chatbots:[]
 }


export const kbobj = Parse.Object.extend('kbclass')

export const getAllKbs = async () => {
    const query = new Parse.Query(kbobj)
    const curUser = Parse.User.current()
    query.equalTo("user", curUser?.id)
    try {
        const knowledgeBase = await query.find()
        if(knowledgeBase!=null){

          return knowledgeBase
        }
        else return false
    } catch (error) {
        console.log(error)
        return error
    }
}
export const generateKb = async (
  
  props: Partial<KbClass>
): Promise<string> => {
  const curUser = Parse.User.current()
  let initValues = { ...blankBlock, ...props }
  const intent = new kbobj()
  try {
    const res = await intent.save(initValues)
    return res.id
  } catch (error) {
    return 'error'
  }
}

// export function generateQuestBlock(props: Partial<QuestBlockProps>) {
//   return { ...blankBlock, ...props }
// }

export const getKb = async (id: string) => {
  const query = new Parse.Query(kbobj)
  try {
    const kb = await query.get(id)
    return kb.attributes
  } catch (error) {
    console.log(error)
    return error
  }
}
