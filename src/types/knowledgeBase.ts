import moment from 'moment'
import Parse from 'parse'
import { curUser } from './user'

export type knowledgeBaseBlock = {
    id: string
    user: string
    name: string
    type: string
    priority: string
    expires: string
    tags: string[]
    transcript: string
    fileUrl: string

}

export const blankBlock: Partial<knowledgeBaseBlock> = {
    user: "",
    name: "",
    type: "",
    priority: "",
    expires: "",
    tags: [],
    transcript: "",
    fileUrl: ""
}


export const knowledgeBase = Parse.Object.extend('knowledgeBase')
export const generateKnowledge = async (

    props: Partial<knowledgeBaseBlock>
): Promise<string> => {
    const curUser = Parse.User.current()
    let initValues = { ...blankBlock, ...props }
    const knowledgeBaseobj = new knowledgeBase()
    try {
        const res = await knowledgeBaseobj.save(initValues)
        return res.id
    } catch (error) {
        return 'error'
    }
}
export const getAllKnowledgeBaseWithType = async (type: string) => {
    const query = new Parse.Query(knowledgeBase)
    const curUser = Parse.User.current()
    query.equalTo("type", type)
    query.equalTo("user", curUser?.id)
    try {
        const knowledgeBase = await query.find()
        console.log("knowledge found")
        console.log(knowledgeBase)
        if(knowledgeBase!=null){

          return knowledgeBase
        }
        else return false
    } catch (error) {
        console.log(error)
        return error
    }
}

export const deleteKnowledgeItem = async (id: string) => {
    const query = new Parse.Query(knowledgeBase)
    try {
        const knowledgeBase = await query.get(id)
        return knowledgeBase.destroy()
    } catch (error) {
        console.log(error)
        return error
    }
}

export const getKnowledgeBase = async (id: string) => {
    const query = new Parse.Query(knowledgeBase)
    try {
        const knowledgeBase = await query.get(id)
        return knowledgeBase.attributes
    } catch (error) {
        console.log(error)
        return error
    }
}
