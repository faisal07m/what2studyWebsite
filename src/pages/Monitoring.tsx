import { useEffect, useState } from 'react'
import PageContainer from '../components/layout/PageContainer'
import 'react-phone-number-input/style.css'
import { Form, Input, Row, Col, Image, Skeleton, Checkbox} from 'antd'
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const Monitoring = () => {

    const options2 = {
        animationEnabled: true,
        title:{
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
        title:{
            text: ""
        },
        data: [{
            type: "pie",
            indexLabel: "{label}: {y}%",		
            startAngle: -90,
            dataPoints: [
              
                { y: 14, label: "Unrated" },
                { y: 8, label: "Disliked" },
                { y: 20, label: "Liked" }	
            ]
        }]
    }
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
            <Row gutter={26} style={{justifyContent:"end"}}>
                    <Col span={5}>
                    <h3 >Durchschnittliche Zeit pro Sitzung</h3><span>5 min 37 sec</span>
                    </Col>
                    <Col span={4}>
                    <h3>Aktive Sitzungen</h3><span>296</span>
                    </Col>

            </Row>
           </fieldset>
           <Row gutter={28}>

                <Col span={11} style={{padding:"50px"}}>
                <h2>Antwortqualität der letzten 30 Tage</h2>
                <CanvasJSChart options = {options} 
				/* onRef={ref => this.chart = ref} */
			/>
                </Col>

                <Col span={10} style={{padding:"50px"}}>
                <h2>Aktivität</h2>
                <CanvasJSChart options = {options2}
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
