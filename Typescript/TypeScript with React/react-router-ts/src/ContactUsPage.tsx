import * as React from "react";
import ContactUs from "./ContactUs";
import { IValues, ISubmitResult } from './Form'
import { wait } from './ProductData'

interface IState {
  name: string;
  email: string;
  reason: string;
  notes: string;
}

class ContactUsPage extends React.Component<{}, IState> {
  public constructor(props: {}) {
    super(props);
    this.state = {
      email: "",
      name: "",
      notes: "",
      reason: ""
    };
  }
  private handleNameChange = (name: string) => {
    this.setState({ name });
  };
  private handleEmailChange = (email: string) => {
    this.setState({ email });
  };
  private handleReasonChange = (reason: string) => {
    this.setState({ reason });
  };
  private handleNotesChange = (notes: string) => {
    this.setState({ notes });
  };
  private handleSubmit = async (values: IValues): Promise<ISubmitResult> => {
    await wait(1000); // simulate asynchronous web API call
    return {
      errors: {
        email: ["Some is wrong with this"]
      },
      success: false
    };
  };
  public render() {
    return (
      <div className="page-container">
        <h1>Contact Us</h1>
        <p>
          If you enter your details we'll get back to you as soon as we can.
        </p>
        <ContactUs
          onSubmit={this.handleSubmit}
          email={this.state.email}
          name={this.state.name}
          notes={this.state.notes}
          reason={this.state.reason}
          onNameChange={this.handleNameChange}
          onEmailChange={this.handleEmailChange}
          onReasonChange={this.handleReasonChange}
          onNotesChange={this.handleNotesChange}
        />
      </div>
    );
  }
}

export default ContactUsPage;
