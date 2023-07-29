import React, { Component } from 'react';
import { Typography, Divider, Spin, Row, Col, Card } from 'antd';
import axios from 'axios';
import StockCard from './StockCard';
import {StockPieChart} from "./StockPieChart";

const queryString = require('query-string');

const {Title, Paragraph, Text} = Typography;

class ResultApp extends Component {

    state = {
        amount: 0,
        strategyList: [],
        loading: true,
        strategyResponse: [],
        amountResponse: [],
        piechartResponse: [],
    };


    async componentDidMount() {
        const values = queryString.parse(this.props.location.search)

        this.setState({amount: parseInt(values.amount), strategyList: values.strategy})

        //API call to server to fetch information

        let postBody = {}
        postBody.Amount = parseInt(values.amount);
        postBody.Strategies = [];
        if (values.strategy.length === 2) {
            postBody.Strategies = [...values.strategy]
        }
        else {
            postBody.Strategies.push(values.strategy)
        }

        console.log(postBody);


        let response = await axios.post(`http://127.0.0.1:5000/getData`, postBody)


        console.log(response);
        console.log(JSON.stringify(response));

        this.setState({loading: false});
        if (response.data.strategiesResponse[1]) {
            this.setState({strategyResponse: [...response.data.strategiesResponse[0], ...response.data.strategiesResponse[1]]});
        }
        else {
            this.setState({strategyResponse: [...response.data.strategiesResponse[0]]});
        }

        this.setState({amountResponse: response.data.amountResponse});
        this.setState({piechartResponse: response.data.piechartResponse});

        console.log("this.state.strategyResponse");
        console.log(this.state.strategyResponse);
        console.log("this.state.piechartResponse");
        console.log(this.state.piechartResponse);

    }

    render() {
        const {strategyList} = this.state;
        let isSecondStrategyPresent = false;

        let formatedSelectedItems;
        if (strategyList.length === 2) {
            formatedSelectedItems = strategyList.join(" & ");
            isSecondStrategyPresent = true;
        }
        else {
            formatedSelectedItems = strategyList;
        }

        return (
            <div className="ResultApp" style={{backgroundImage:"url(" + "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTie7-8Nh6U-4K1I-Y9X-9JsOkr_bZy_GuDmb7v9rARezo4KUNoF6CzZ9jGte41Vn1pU7s&usqp=CAU" + ")",backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            }}>
                <div className="box effect1">
                    <Typography>
                        <div style={{textAlign: 'center'}}>

                            <Title level={3}> <a href="/" style={{color:"white"}}>Stock Portfolio Suggestion Engine </a></Title>

                        </div>
                        <Divider/>
                    </Typography>
                    <Spin tip="Loading..." spinning={this.state.loading}>
                        <div>
                            <Text strong style={{color:"white"}}>Amount: </Text> <Text style={{color:"white"}}>$ {this.state.amount}</Text>

                            <div style={{float: 'right'}}>
                                <Text strong style={{color:"white"}}>Investing Strategies: </Text><Text style={{color:"white"}}>{formatedSelectedItems}</Text>
                            </div>
                        </div>
                        <Divider/>

                        {!isSecondStrategyPresent &&
                        <div>
                            <div style={{textAlign: 'left'}}><Title level={4} style={{color:"white",textAlign: 'left'}}>{strategyList} </Title></div>
                            <br/>
                            <div style={{padding: '30px'}}>
                                <Row gutter={16}>
                                    <StockCard data={this.state.strategyResponse[0]}
                                               amount={this.state.amountResponse[0]}/>
                                    <StockCard data={this.state.strategyResponse[1]}
                                               amount={this.state.amountResponse[1]}/>
                                    <StockCard data={this.state.strategyResponse[2]}
                                               amount={this.state.amountResponse[2]}/>
                                </Row>
                            </div>
                        </div>
                        }

                        {isSecondStrategyPresent &&
                        <div>
                            <div style={{textAlign: 'left'}}><Title level={4} style={{color:"white"}}>{strategyList[0]} </Title></div>
                            <br/>
                            <div style={{padding: '30px'}}>
                                <Row gutter={16}>
                                    <StockCard data={this.state.strategyResponse[0]}
                                               amount={this.state.amountResponse[0]}/>
                                    <StockCard data={this.state.strategyResponse[1]}
                                               amount={this.state.amountResponse[1]}/>
                                    <StockCard data={this.state.strategyResponse[2]}
                                               amount={this.state.amountResponse[2]}/>
                                </Row>
                            </div>
                            <Divider/>
                            <div style={{textAlign: 'left'}}><Title level={4} style={{color:"white"}}>{strategyList[1]} </Title></div>
                            <div style={{padding: '30px'}}>
                                <Row gutter={16}>
                                    <StockCard data={this.state.strategyResponse[3]}
                                               amount={this.state.amountResponse[0]}/>
                                    <StockCard data={this.state.strategyResponse[4]}
                                               amount={this.state.amountResponse[1]}/>
                                    <StockCard data={this.state.strategyResponse[5]}
                                               amount={this.state.amountResponse[2]}/>
                                </Row>
                            </div>
                        </div>
                        }

                    </Spin>
                </div>
                {/* <div className="box effect1">
                <div style={{textAlign: 'center'}}><Title level={4} style={{color:"white"}}>Graphical Representation</Title></div>
                <StockPieChart data={this.state.piechartResponse}/>
                </div> */}
            </div>
        );
    }
}


export default ResultApp;
