import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
let count = 0;
const counterConsoleLog = function (
  name: string,
  tableData: {
    prevProps?: any;
    currentProps?: any;
    nextProps?: any;
    prevState?: any;
    currentState?: any;
    nextState?: any;
    // For FC
    props?: any;
    state?: any;
    innerText?: any;
  } = {},
) {
  console.log(count, name);
  console.table(
    Object.entries(tableData).reduce((pre, [k, v]) => {
      pre[k] = typeof v === "object" ? JSON.stringify(v) : v ?? "unset";
      return pre;
    }, {} as any),
  );
  count += 1;
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const AppFC = function (props) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    counterConsoleLog("AppFC useEffect", {
      props,
      state: { count },
      innerText: ref.current.innerText,
    });
    return () => {
      counterConsoleLog("AppFC useEffect cleanup", {
        props,
        state: { count },
        innerText: ref.current.innerText,
      });
    };
  }, [count]);
  useIsomorphicLayoutEffect(() => {
    counterConsoleLog("AppFC useLayoutEffect", {
      props,
      state: { count },
      innerText: ref.current.innerText,
    });
    return () => {
      counterConsoleLog("AppFC useLayoutEffect cleanup", {
        props,
        state: { count },
        innerText: ref.current.innerText,
      });
    };
  });
  counterConsoleLog("AppFC render", { props, state: { count } });
  return (
    <div ref={ref}>
      {`AppFC ${count}`}
      <div>
        <button
          onClick={() => {
            setCount((_count) => _count + 1);
          }}
        >
          {"update"}
        </button>
      </div>
    </div>
  );
};

export class AppCC extends React.Component<
  {},
  {
    count: number;
  }
> {
  constructor(props) {
    counterConsoleLog("AppCC constructor", props);
    super(props);
    this.componentDidMount = () => {
      counterConsoleLog("AppCC componentDidMount", {
        currentProps: this.props,
        currentState: this.state,
      });
    };

    this.shouldComponentUpdate = (nextProps, nextState) => {
      counterConsoleLog("AppCC shouldComponentUpdate", {
        currentProps: this.props,
        currentState: this.state,
        nextProps,
        nextState,
      });
      return true;
    };

    this.getSnapshotBeforeUpdate = (prevProps, prevState) => {
      counterConsoleLog("AppCC getSnapshotBeforeUpdate", {
        prevProps,
        prevState,
        currentProps: this.props,
        currentState: this.state,
      });
    };

    this.componentDidUpdate = (prevProps, prevState) => {
      counterConsoleLog("AppCC componentDidUpdate", {
        prevProps,
        prevState,
        currentProps: this.props,
        currentState: this.state,
      });
    };

    this.componentWillUnmount = () => {
      counterConsoleLog("AppCC componentWillUnmount", {
        currentProps: this.props,
        currentState: this.state,
      });
    };

    this.state = {
      count: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    counterConsoleLog("AppCC getDerivedStateFromProps", {
      nextProps,
      prevState,
    });
    return null;
  }

  render() {
    counterConsoleLog("AppCC render", {
      currentProps: this.props,
      currentState: this.state,
    });
    return (
      <div>
        {`AppCC ${this.state.count}`}
        <div>
          <button
            onClick={() => {
              this.setState((state) => ({
                count: state.count + 1,
              }));
            }}
          >
            {"update"}
          </button>
        </div>
      </div>
    );
  }
}

export default () => {
  return (
    <>
      <AppFC />
      <AppCC />
    </>
  );
};
