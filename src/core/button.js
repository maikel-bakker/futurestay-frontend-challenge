/**
 * Button component
 * @param children {JSX.Element | string}
 * @param color {('red'|'green')}
 * @param props
 * @returns {JSX.Element}
 */
export const Button = ({ children, color, ...props }) => {
  return (
    <button {...props} className={`button upcase large semi-bold ${color}`}>
      {children}
    </button>
  );
};
