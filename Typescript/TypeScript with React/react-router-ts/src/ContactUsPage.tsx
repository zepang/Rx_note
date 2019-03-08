import * as React from 'react'
import ContactUs from './ContactUs'

interface IState {
  name: string;
  email: string;
  reason: string;
  notes: string;
}

class ContactUsPage extends React.Component<{}, IState>{
  public constructor (props: {}) {
    super(props)
    this.state = {
      email: "",
      name: "",
      notes: "",
      reason: ""
    }
  }
  private handleNameChange = (name: string) => {
    this.setState({name})
  }
  private handleEmailChange = (email: string) => {
    this.setState({email})
  }
  private handleReasonChange = (reason: string) => {
    this.setState({reason})
  }
  private handleNotesChange = (notes: string) => {
    this.setState({notes})
  }
  public render () {
    return (
      <div className="page-container">
        <h1>Contact Us</h1>
        <p>
          If you enter your details we'll get back to you as soon as we can.
        </p>
        <ContactUs
          email={this.state.email}
          name={this.state.name}
          notes={this.state.notes}
          reason={this.state.reason}
          onNameChange={this.handleNameChange}
          onEmailChange={this.handleEmailChange}
          onReasonChange={this.handleReasonChange}
          onNotesChange={this.handleNotesChange}
        ></ContactUs>
      </div>
    )
  }
}

export default ContactUsPage
