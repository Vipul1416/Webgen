import React, { Component } from 'react';
import Menu from './MenuComponent';
import Detail from './dishDetail';

import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import About from '../components/AboutComponent';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}


class Main extends Component {

    constructor(props) {
      super(props);
      this.state={
        dishes:[],

      }
    
    
    }
    componentDidMount() {
      // const proxyurl = "https://cors-anywhere.herokuapp.com/";
      // const url="https://localhost:3001/dishes"
      const url= "http://localhost:3000/dishes"
      fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
           
            this.setState({
              dishes: result
            });
            console.log(this.state.dishes);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }
    

   
  
    render() {
      const DishWithId = ({match}) => {
        return(
            <Detail dish={this.state.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]} 
              comments={this.props.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId,10))} />
        );
      }
      const HomePage = () => {
        return(
            <Home 
                dish={this.props.dishes.filter((dish) => dish.featured)[0]}
                promotion={this.props.promotions.filter((promo) => promo.featured)[0]}
                leader={this.props.leaders.filter((leader) => leader.featured)[0]}
            />
        );
      }
      return (
        <div>
          <Header/>
          <Switch>
              <Route path='/home' component={HomePage} />
              <Route exact path='/menu' component={() => <Menu dishes={this.state.dishes} />} />
              <Route path='/menu/:dishId' component={DishWithId} />
              <Route exact path='/contactus' component={Contact} />
              <Route exact path='/aboutus' component={() => <About leaders={this.props.leaders}/>}/>
              <Redirect to="/home" />
              
          </Switch>
          
          <Footer/>
        </div>
      );
    }
  }
  
  
  export default withRouter(connect(mapStateToProps)(Main));