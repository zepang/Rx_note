import * as React from 'react'

interface ITabProps {
  name: string;
  heading: () => string | JSX.Element;
  initialActive?: boolean;
}

interface ITabsContext {
  activeName?: string;
  handleTabClick?: (name: string, content: React.ReactNode) => void
}

interface IState {
  activeName: string;
  activeContent: React.ReactNode;
}

const TabsContext = React.createContext<ITabsContext>({})

class Tabs extends React.Component<{}, IState> {
  public constructor (props: {}) {
    super(props)
    this.state = {
      activeName: '',
      activeContent: ''
    }
  }

  public static Tab: React.SFC<ITabProps> = (props) => {
    let ctx: ITabsContext = React.useContext(TabsContext)
    React.useEffect(() => {
      if (!ctx.activeName && props.initialActive) {
          if (ctx.handleTabClick) {
            ctx.handleTabClick(props.name, props.children)
          }
        }
    }, [])
    return (
      <TabsContext.Consumer>
        {(context: ITabsContext) => {
          const activeName = context.activeName ? context.activeName : props.initialActive ? props.name : ''
          const handleTabClick = (e: React.MouseEvent<HTMLLIElement>) => {
            if (context.handleTabClick) {
              context.handleTabClick(props.name, props.children)
            }
          }
          return (
            <li className={props.name === activeName ? 'active' : ''}
              onClick={handleTabClick}
            >{ props.heading() }</li>
          )
        }}
      </TabsContext.Consumer>
    )
  }

  private handleTabClick =  (name: string, content: React.ReactNode) => {
    this.setState({ activeName: name, activeContent: content })
  }
  public render () {
    return (
      <TabsContext.Provider
        value={{
          activeName: this.state ? this.state.activeName : '',
          handleTabClick: this.handleTabClick
        }}>
        <ul className="tabs">{ this.props.children }</ul>
        <div>{this.state && this.state.activeContent}</div>
      </TabsContext.Provider>
    )
  }
}

export default Tabs