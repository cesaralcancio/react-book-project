import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from '../componentes/InputCustomizado';
import Submit from '../componentes/Submit';
import PubSub from 'pubsub-js';
import TratadorErros from '../class/TratadorErros'

class FormularioAutor extends Component {
    constructor() {
        super();
        this.state = {lista : [], nome: 'algo', email: "algoo@algoo.com", senha: "123"};
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
      }

      enviaForm(evento) {
        evento.preventDefault();
        console.log("dados sendo enviados FormularioAutor");
    
        $.ajax({
          url:"http://localhost:8080/api/autores",
          contentType: 'application/json',
          dataType:'json',
          type:'post',
          data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
          success: function(resposta){
            console.log("enviado com sucesso FormularioAutor");
            //disparar aviso geral de que deve-se atualizar a lista
            PubSub.publish('atualiza-lista-autores', resposta);
            this.setState({nome: '', email: '', senha: ''});
          }.bind(this),
          error: function(resposta){
              console.log("erro FormularioAutor");
              if(resposta.status === 400){
                new TratadorErros().publicaErros(resposta.responseJSON);
              }
          },
          beforeSend: function() {
            PubSub.publish("limpa-erros", {});
          }
        });
      }
    
      setNome(evento) {
        console.log("setNome FormularioAutor");
        this.setState({nome:evento.target.value});
      }
    
      setEmail(evento) {
        console.log("setEmail FormularioAutor");
        this.setState({email:evento.target.value});
      }
    
      setSenha(evento) {
        console.log("setSenha FormularioAutor");
        this.setState({senha:evento.target.value});
      }

      render() {
          return (
            <div className="pure-form pure-form-aligned"> 
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado label="Nome" id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} />
                    <InputCustomizado label="E-mail" id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} />
                    <InputCustomizado label="Senha" id="senha" type="senha" name="senha" value={this.state.senha} onChange={this.setSenha} />
                    <Submit label="Gravar"/>
                </form>
            </div> 
          );
    }
}

class TabelaAutores extends Component {

    render() {
        return(
            <div>            
              <table className="pure-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>email</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.lista.map( autor => {
                      return (
                        <tr key={autor.id}>
                          <td>{autor.nome}</td>
                          <td>{autor.email}</td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
          </div>
        );
    }
}

export default class AutorBox extends Component {

  constructor() {
      super();
      this.state = {lista : []};
      this.atualizaListagem = this.atualizaListagem.bind(this);
  }

  componentDidMount() {
      console.log('didMount TabelaAutores');
      $.ajax({
        url:"http://localhost:8080/api/autores",
        dataType: 'json',
        success:function(resposta){
          this.setState({lista:resposta});
        }.bind(this)
      });

      PubSub.subscribe('atualiza-lista-autores', function(topico, novaLista){
        console.log("receive pubsub atualiza-lista-autores")
        this.setState({lista:novaLista});
      }.bind(this));
  }

  atualizaListagem(novaLista) {
    this.setState({lista:novaLista});
  }

  render () {
    return (
      <div>
        <div className="header">
          <h1>Cadastro de autores</h1>
        </div>
        <div className="content" id="content">
          <FormularioAutor/>
          <TabelaAutores lista={this.state.lista}/>
        </div>
      </div>
      );
  }
}