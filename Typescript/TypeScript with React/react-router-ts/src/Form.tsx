import * as React from "react";

interface IValues {
  [key: string]: any;
}

export type Validator = (
  fieldName: string,
  values: IValues,
  args?: any
 ) => string

export const required: Validator = (
  fieldName: string,
  values: IValues,
  args?: any
): string => 
  values[fieldName] === undefined ||
  values[fieldName] === null ||
  values[fieldName] === '' ?
  'this must be populated' : ''

export const minLength: Validator = (
  fieldName: string,
  values: IValues,
  args?: any
): string => 
values[fieldName] && values[fieldName].length < length ? 
  `This must be at least ${length} characters` : ""

interface IValidation {
  validator: Validator;
  arg?: any;
}

interface IValidationProp {
  [key: string]: IValidation | IValidation[];
}

interface IFormProps {
  defaultValues: IValues;
  validationRules?: IValidationProp
}

interface IState {
  values: IValues;
}

interface IFieldProps {
  name: string;
  label: string;
  type: "Text" | "Email" | "Select" | "TextArea";
  options?: string[];
}

interface IFormContext {
  values: IValues;
  setValue?: (filedName: string, value: any) => void;
}
const FormContext = React.createContext<IFormContext>({
  values: {}
});

export class Form extends React.Component<IFormProps, IState> {
  public constructor(props: IFormProps) {
    super(props);
    this.state = {
      values: props.defaultValues
    };
  }
  public static Field: React.SFC<IFieldProps> = props => {
    const { name, label, type, options } = props;
    const context = React.useContext(FormContext);
    const handleChange = (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>,
      context: IFormContext
    ) => {
      if (context.setValue) {
        context.setValue(props.name, e.currentTarget.value);
      }
    };
    return (
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        {(type === "Text" || type === "Email") && (
          <input
            type={type.toLowerCase()}
            id={name}
            value={context.values[name]}
            onChange={e => handleChange(e, context)}
          />
        )}
        {type === "TextArea" && (
          <textarea 
            id={name} 
            value={context.values[name]} 
            onChange={e => handleChange(e, context)}/>
        )}
        {type === "Select" && (
          <select 
            value={context.values[name]} 
            onChange={e => handleChange(e, context)}>
            {options &&
              options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </select>
        )}
      </div>
    );
  };
  private setValue = (filedName: string, value: any) => {
    const newValues = { ...this.state.values, [filedName]: value };
    this.setState({ values: newValues });
  };
  public render() {
    const context: IFormContext = {
      values: this.state.values,
      setValue: this.setValue
    };
    return (
      <FormContext.Provider value={context}>
        <form className="form" noValidate={true}>
          {this.props.children}
        </form>
      </FormContext.Provider>
    );
  }
}

Form.Field.defaultProps = {
  type: "Text"
};
