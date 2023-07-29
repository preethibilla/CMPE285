import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Steps, Row, Col, Button, message, Form, InputNumber, Select, Typography, Divider } from 'antd';
import { history } from './history';
import { fixControlledValue } from 'antd/lib/input/Input';

const queryString = require('query-string');

const {Title, Paragraph, Text} = Typography;


const Step = Steps.Step;
const OPTIONS = ['Ethical Investing', 'Growth Investing', 'Index Investing', 'Quality Investing', 'Value Investing'];


const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 5},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
    },
};


function validateNumber(number) {
    if (number < 5000) {
        return 'error';
    }

    return 'success';
}

class App extends Component {

    state = {
        current: 0,
        showSubmit: false,
        enableBack: false,
        validateNumberStatus: 'success',
        validateOptionStatus: 'success',
        amount: 5000,
        selectedItems: [],
    };

    componentDidMount() {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js'
        script.async = true;
        script.innerHTML = JSON.stringify({
            "showChart": true,
            "locale": "en",
            "largeChartUrl": "",
            "width": "100%",
            "height": "660",
            "plotLineColorGrowing": "rgba(33, 150, 243, 1)",
            "plotLineColorFalling": "rgba(33, 150, 243, 1)",
            "gridLineColor": "rgba(233, 233, 234, 1)",
            "scaleFontColor": "rgba(131, 136, 141, 1)",
            "belowLineFillColorGrowing": "rgba(5, 122, 205, 0.12)",
            "belowLineFillColorFalling": "rgba(5, 122, 205, 0.12)",
            "symbolActiveColor": "rgba(225, 239, 249, 1)",
            "tabs": [
                {
                    "title": "Indices",
                    "symbols": [
                        {
                            "s": "OANDA:SPX500USD",
                            "d": "S&P 500"
                        },
                        {
                            "s": "INDEX:XLY0",
                            "d": "Shanghai Composite"
                        },
                        {
                            "s": "FOREXCOM:DJI",
                            "d": "Dow 30"
                        },
                        {
                            "s": "INDEX:NKY",
                            "d": "Nikkei 225"
                        },
                        {
                            "s": "INDEX:DAX",
                            "d": "DAX Index"
                        },
                        {
                            "s": "OANDA:UK100GBP",
                            "d": "FTSE 100"
                        }
                    ],
                    "originalTitle": "Indices"
                },
                {
                    "title": "Commodities",
                    "symbols": [
                        {
                            "s": "CME_MINI:ES1!",
                            "d": "E-Mini S&P"
                        },
                        {
                            "s": "CME:E61!",
                            "d": "Euro"
                        },
                        {
                            "s": "COMEX:GC1!",
                            "d": "Gold"
                        },
                        {
                            "s": "NYMEX:CL1!",
                            "d": "Crude Oil"
                        },
                        {
                            "s": "NYMEX:NG1!",
                            "d": "Natural Gas"
                        },
                        {
                            "s": "CBOT:ZC1!",
                            "d": "Corn"
                        }
                    ],
                    "originalTitle": "Commodities"
                },
                {
                    "title": "Bonds",
                    "symbols": [
                        {
                            "s": "CME:GE1!",
                            "d": "Eurodollar"
                        },
                        {
                            "s": "CBOT:ZB1!",
                            "d": "T-Bond"
                        },
                        {
                            "s": "CBOT:UD1!",
                            "d": "Ultra T-Bond"
                        },
                        {
                            "s": "EUREX:GG1!",
                            "d": "Euro Bund"
                        },
                        {
                            "s": "EUREX:II1!",
                            "d": "Euro BTP"
                        },
                        {
                            "s": "EUREX:HR1!",
                            "d": "Euro BOBL"
                        }
                    ],
                    "originalTitle": "Bonds"
                },
                {
                    "title": "Forex",
                    "symbols": [
                        {
                            "s": "FX:EURUSD"
                        },
                        {
                            "s": "FX:GBPUSD"
                        },
                        {
                            "s": "FX:USDJPY"
                        },
                        {
                            "s": "FX:USDCHF"
                        },
                        {
                            "s": "FX:AUDUSD"
                        },
                        {
                            "s": "FX:USDCAD"
                        }
                    ],
                    "originalTitle": "Forex"
                }
            ]
        });
        // document.getElementById("marketgraph").appendChild(script);
    }

    handleNext = () => {

        if (this.state.current === 1 && this.state.selectedItems.length > 2) {
            message.error('Error : More strategies');
            this.setState(({validateOptionStatus: 'error'}))
        }
        else if (this.state.current === 1 && this.state.selectedItems.length === 0) {
            message.error('Invalid Selection');
            this.setState(({validateOptionStatus: 'error'}))
        }
        else if (this.state.current === 0 && this.state.amount < 5000) {
            message.error('Please select valid amount');
        }
        else {
            this.setState(({validateOptionStatus: 'success'}))
            let newVal = this.state.current + 1;
            if (newVal === 2) {
                this.setState(({showSubmit: true}))
            }
            this.setState({current: (newVal)});
            this.setState({enableBack: true});
        }

    };

    handleBack = () => {

        let newVal = this.state.current - 1;
        if (newVal === 0) {
            this.setState({enableBack: false});
        }
        this.setState(({showSubmit: false}))
        this.setState({current: (newVal)});

    };

    handleSubmit = () => {
        this.setState({current: 3});
        message.info('Fetching Results');
        let query = {};
        query.amount = this.state.amount;
        query.strategy = this.state.selectedItems;

        const stringified = queryString.stringify(query);


        history.push('/results?' + stringified);

    }


    handleNumberChange = (value) => {
        this.setState({
            validateNumberStatus: validateNumber(value),
            amount: value
        });
    }

    handleOptionChange = selectedItems => {
        this.setState({selectedItems});
    };

    render() {
        const {selectedItems} = this.state;
        const formatedSelectedItems = selectedItems.join(" & ");
        const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));


        return (
            <div className="App" style={{backgroundImage:"url(" + "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTie7-8Nh6U-4K1I-Y9X-9JsOkr_bZy_GuDmb7v9rARezo4KUNoF6CzZ9jGte41Vn1pU7s&usqp=CAU" + ")",backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',height: '1000px' }}>
                <div className="box effect1">
                    <Typography>
                        <div style={{textAlign: 'center', color:"white"}}>
                            <Title level={3}> <a href="/" style={{color:"white"}}>Stock Portfolio Suggestion Engine </a></Title>
                        </div>
                        <Divider/>
                    </Typography>
                    <Row style={{
    marginTop: "200px"
}}>
                        <Col span={8}>
                            {/* <div className="stepsClass">
                                <Steps direction="vertical" size="small" current={this.state.current}>
                                    <Step title="Investment Amount" description="Investment Amount (in $)"/>
                                    <Step title="Choose Investment Strategy"
                                          description="Choose upto 2 Strategies"/>
                                    <Step title="Confirm" description="Check Input"/>
                                </Steps>
                            </div> */}
                        </Col>
                        <Col span={16}>
                            <div className="contentClass">
                                <Form {...formItemLayout}>
                                    {(this.state.current === 0 &&
                                        <div>
                                            <h1 style={{color:"white"}}>Select the amount</h1>
                                            <Form.Item
                                                validateStatus={this.state.validateNumberStatus}
                                                
                                                style={{width: '100%'}}
                                            >
                                                <InputNumber placeholder="Enter Amount"
                                                             defaultValue={5000}
                                                             value={this.state.amount}
                                                             formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                             parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                             style={{width: '100%'}}
                                                             onChange={this.handleNumberChange}/>
                                            </Form.Item>
                                        </div>)
                                    || (this.state.current === 1 &&
                                        <div>
                                             <h1 style={{color:"white"}}>Select the strategy</h1>
                                            <Form.Item
                                                help="Pick one or two Investment strategies"
                                                validateStatus={this.state.validateOptionStatus}
                                                style={{width: '100%'}}
                                            >
                                                <Select
                                                    mode="multiple"
                                                    placeholder="Investment strategies"
                                                    value={selectedItems}
                                                    onChange={this.handleOptionChange}
                                                    style={{width: '100%'}}
                                                >
                                                    {filteredOptions.map(item => (
                                                        <Select.Option key={item} value={item} style={{backgroundColor:"#ed9127",color:"white"}}>
                                                            {item}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </div>)
                                    || (this.state.current === 2 &&
                                        
                                        <div style={{background:"grey", width:'50%',padding:"20px",borderRadius:"5px",marginBottom:"20px"}} >
                                             <h1 style={{color:"white"}}>Summary</h1>
                                            <Text strong style={{ color: "white"}} >Amount: </Text> <Text style={{ color: "white"}}>{this.state.amount}</Text>
                                            <br/>
                                            <Text strong style={{ color: "white"}}>Investing
                                                Strategies: </Text><Text style={{ color: "white"}}>{formatedSelectedItems}</Text>
                                        </div>)
                                    }
                                </Form>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={6} offset={10}>
                            {!this.state.enableBack &&
                            <Button onClick={this.handleBack} style={{marginRight: 20}} disabled>Back</Button>
                            }

                            {this.state.enableBack &&
                            <Button onClick={this.handleBack} style={{marginRight: 20}}>Back</Button>
                            }

                            {!this.state.showSubmit &&
                            <Button type="primary" onClick={this.handleNext} >Proceed</Button>
                            }

                            {this.state.showSubmit &&
                            <Button type="primary" onClick={this.handleSubmit}>Submit Selection</Button>
                            }

                        </Col>
                    </Row>


                </div>
                <div className="box effect1" style={{textAlign: 'center'}}>
                    <Row>
                        <Col>
                            {/* <Typography> */}
                                {/* <Title level={4}> Market Overview Widget</Title> */}
                            {/* </Typography>
                            Market Overview Widget provides a quick glance at the latest market activity across various
                            sectors. */}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16} offset={4}>
                            <div id="marketgraph">
                                {/* <div className="tradingview-widget-container">
                                    <div className="tradingview-widget-container__widget"></div>

                                </div> */}
                            </div>
                        </Col>
                        <Col span={12}></Col>
                    </Row>

                </div> 
            </div>
        );
    }
}

export default App;
 
