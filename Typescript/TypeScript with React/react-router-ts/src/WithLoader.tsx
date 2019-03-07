import * as React from 'react'

interface IProps {
  loading: boolean;
}

const withLoader = <T extends {}>(Component: React.ComponentType<T>): React.SFC<T & IProps> => (props: T & IProps) => {
    return props.loading ? (<div className="loader-overlay">
        <div className="loader-circle-wrap">
          <div className="loader-circle" />
        </div>
      </div>
    ) : (
      <Component {...props} />
    )
  }
export default withLoader
