import { useEffect, useState } from 'react'
import PageContainer from '../components/layout/PageContainer'
import 'react-phone-number-input/style.css'
import { Form, Input, Row, Col, Image, Skeleton, Checkbox } from 'antd'
import CanvasJSReact from '@canvasjs/react-charts';
import ChatClient from "what2study-chatclient";

import Parse from 'parse'
import { getActiveChatbotID, getScriptTag } from '../types/JobOffers';

const Chatbot = () => {

    const [token, setToken] = useState<any>()
    const setScriptTagAsync = async () => {
        getScriptTag().then(function (val) {
            var token = /token=.*'/g.exec(val)
            if (token) {
                setToken(token[0].slice(6, -1))
            }
            return val
        })
    }
    const [activeChatbotID, setActiveChatID] = useState<any>("")

    var activeIDset = async () => {
        let res = await getActiveChatbotID()
        setActiveChatID(res)
    }
    useEffect(() => {
        activeIDset()
        setScriptTagAsync()
    }, [])
    return (
        <div>
            <PageContainer
                title={'Chat Window'}
                pageId='7'
                button
            >
                 {activeChatbotID ?
                <div style={{ height: "700px", width: "60%", position: "relative" }}>

                 {/* <div className='speech-bubble'>Klick mich</div> */}
                    <div style={{
                        position: "absolute", bottom: 0,
                        right: 0
                    }}>
                        <ChatClient
                            objectId={activeChatbotID}
                            userId={Parse.User.current()?.id}
                            universityId={Parse.User.current()?.id}
                            accessToken={token}
                            chatbotId={activeChatbotID}
                            testRequest={true}
                        ></ChatClient>
                    </div>
                </div>:<h2> Um einen Chatbot zunächst zu testen, müssen Sie einen Chatbot veröffentlichen</h2>}
                
            </PageContainer>
        </div>

    )
}

export default Chatbot
