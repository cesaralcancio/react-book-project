import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class InputCustomizado extends Component {
    
    constructor() {
        super();
        this.state = {msgErro: ''};
    }

    render () {
        console.log("Input Customizado");

        return (
            <div className="pure-control-group">
                <label htmlFor="nome">{this.props.label}</label>
                {/* <input id={this.props.id} type={this.props.type} name={this.props.nome} value={this.props.value} onChange={this.props.onChange} /> */}
                {/* spread operator example instead of the code below */}
                <input {...this.props} />
                <span className="erro">{this.state.msgErro}</span>
            </div>
        );
    }

    componentDidMount () {
        PubSub.subscribe("erro-validacao", function(topico, erro) {
            if (erro.field == this.props.name) {
                this.setState({msgErro: erro.defaultMessage});
            }
        }.bind(this));

        PubSub.subscribe("limpa-erros", function(topico, erro) {
            this.setState({msgErro: ""});
        }.bind(this));
    }
}