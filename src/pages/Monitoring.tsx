import { useEffect, useState } from 'react'
import PageContainer from '../components/layout/PageContainer'
import 'react-phone-number-input/style.css'
import { Form, Input, Row, Col, Image, Skeleton, Checkbox } from 'antd'
import CanvasJSReact from '@canvasjs/react-charts';
import Parse from 'parse'
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const Monitoring = () => {
    var currentUser = Parse.User.current()
    const [chatbots, setChatbots] = useState<string[]>(currentUser?.attributes.Joblist)

    const [disliked, setDisliked] = useState<number>(0)

    const [feedbackList, setFeedbackList] = useState<any>()

    const [chathistoryList, setChatHistoryList] = useState<any>()
    useEffect(() => {

        if (feedbackList) {
            var liked = 0
            var disliked = 0
            for (let i = 0; i < feedbackList.length; i++) {
                if(feedbackList[i].type==false){
                    disliked = disliked +1
                }
                else{
                    liked= liked +1
                }
            }

            setDisliked(disliked)
            setLiked(liked)
        }
    }, [feedbackList])

    useEffect(() => {

        if (chathistoryList) {
            console.log(chathistoryList)
            console.log(chathistoryList[0])
        }
    }, [chathistoryList])

    const [liked, setLiked] = useState<number>(0)
    const options2 = {
        animationEnabled: true,
        title: {
            text: ""
        },
        axisX: {
            valueFormatString: ""
        },
        axisY: {
            title: "Nutzer",
        },
        data: [{
            yValueFormatString: "",
            xValueFormatString: "",
            type: "spline",
            dataPoints: [
                { x: new Date(2024, 0), y: 100 },
                { x: new Date(2024, 1), y: 150 },
                { x: new Date(2024, 2), y: 200 },
                { x: new Date(2024, 3), y: 370 },
                { x: new Date(2024, 4), y: 300 },
            ]
        }]
    }
    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1", // "light1", "dark1", "dark2"
        title: {
            text: ""
        },
        data: [{
            type: "pie",
            indexLabel: "{label}: {y}%",
            startAngle: -90,
            dataPoints: [
                { y: disliked, label: "Disliked" },
                { y: liked, label: "Liked" }
            ]
        }]
    }

    const promissFunc = async (chatbots) => {
        if (chatbots) {
            var feedbacks = Parse.Object.extend("feedback");
            var chathistory = Parse.Object.extend("userChat")
            var list = [] as any
            var chatHistoryList = [] as any
            for (let i = 0; i < chatbots.length; i++) {
                var q = new Parse.Query(feedbacks);
                q.equalTo("chatbotId", chatbots[i])
                var response = await q.find()
                if (response) {
                    response.forEach(feedback => {
                        list.push(feedback.attributes)
                    });
                }

            }
            setFeedbackList(list)

            for (let i = 0; i < chatbots.length; i++) {
                var q2 = new Parse.Query(chathistory);
                q2.equalTo("chatbotId", chatbots[i])
                var response = await q2.find()
                if (response) {
                    response.forEach(feedback => {
                        chatHistoryList.push(feedback.attributes)
                    });
                }

            }
            setChatHistoryList(chatHistoryList)

        }

    }
    useEffect(() => {

        promissFunc(chatbots)
    }, [chatbots])

    return (
        <div>
            <PageContainer
                title={'Monitoring'}
                pageId='6'
                button
                buttonText='Speichern'
            // buttonCallback={onSave}
            // buttonLoading={loading}
            >
                <Form layout='vertical' name='basic' style={{ marginTop: '-50px' }}>

                    <fieldset className="fieldsetCustom">
                        <legend>Allgemeine Informationen</legend>
                        {/* <Row gutter={26} style={{justifyContent:"end"}}>
                    <Col span={5}>
                    <h3 >Durchschnittliche Zeit pro Sitzung</h3><span>5 min 37 sec</span>
                    </Col>
                    <Col span={4}>
                    <h3>Aktive Sitzungen</h3><span>296</span>
                    </Col>

            </Row> */}
                    </fieldset>
                    <Row gutter={28}>

                        <Col span={11} style={{ padding: "50px" }}>
                            <h2>Antwortqualität der letzten 30 Tage</h2>
                            <CanvasJSChart options={options}
                            /* onRef={ref => this.chart = ref} */
                            />
                        </Col>

                        <Col span={10} style={{ padding: "50px" }}>
                            <h2>Aktivität</h2>
                            <CanvasJSChart options={options2}
                            /* onRef={ref => this.chart = ref} */
                            />


                        </Col>
                    </Row>
                </Form>

            </PageContainer>
        </div>

    )
}

export default Monitoring
