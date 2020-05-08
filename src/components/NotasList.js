import React from 'react'

export default class NotasList extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            loading: false,
            notasAll: [], 
            opcionFiltro: "todas",
            opcionesFiltro: ["todas","noticias","guayaquil","deportes","entretenimiento", "la revista"],
            principales: []
        }
        
        this.updatePrincipales = this.updatePrincipales.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    
    componentDidMount(){
        this.fetchData()
    }

    async fetchData(){
                const api_key = "489ca5d5c6e07f057ec7d9a6a69be9d8";
                const limit = 1000;
                this.setState({loading:true})        
                await fetch("http://api.chartbeat.com/live/toppages/v3/?apikey="+api_key+"&host=eluniverso.com&limit="+limit+"")
                 .then(response => {
                    return response.json();
                  }).then(data => {    
                    let temp = [].concat(data.pages)
                    let tempNoArticlesCero = []
                    temp.map(nota => {
                        if (nota.stats.article > 0){
                            tempNoArticlesCero.push(nota)
                        }return true
                    })
                    tempNoArticlesCero.sort((a,b)=> a.stats.visits + b.stats.visits)
                    this.setState({notasAll: tempNoArticlesCero})
                    let princ = tempNoArticlesCero.slice(0,5)
                    this.setState({principales: princ, loading:false})
                  }).catch(err => {
                    console.log("Error Reading data " + err);
                  });
    }

    goto(link){
        window.open("https://"+link)
    }

    handleChange(event){
        this.setState({opcionFiltro: event.target.value});
        this.updatePrincipales(event.target.value);
    }

    updatePrincipales(filtro){
        if(filtro !== "todas"){
            let temp = []
            this.state.notasAll.map(nota => {
            if(nota.sections.includes(filtro)){
                 temp.push(nota)
            }return true
        })
            let news = temp.slice(0,5)
            this.setState({principales: news})
        }else if (filtro === "todas"){
            let temp = []
            this.state.notasAll.map(nota => {
                 temp.push(nota)
                 return true
                })
            let news = temp.slice(0,5)
            this.setState({principales: news})
        }
    }

    render(){
        return(
            <div className="container">
                <div>
                <label>Filtrar por: </label>
                    <select value={this.state.opcionFiltro} onChange={this.handleChange}>
                        {this.state.opcionesFiltro.map((opt, index)=>(
                            <option value={opt} key={index}>{opt}</option>
                        ))}
                    </select>
                </div>
                <h4 className="titulo-1 MS-font">lo más leído</h4>

                <div>
                {this.state.loading ? <h5>Cargando notas...</h5> : 
                    this.state.principales.map((nota,index) => (
                        <div className="nota-item" key={index}>
                            <div className="col-2"><h2 className="PT-font Nota-Num">{index+1}</h2></div>
                            <div className="col-8 enlace" onClick={() =>this.goto(nota.path)}><h4 className="MS-font">{JSON.stringify(nota.title)}</h4></div>
                        </div>
                    ))
                }
                </div> 
            </div>
        )
    }
}