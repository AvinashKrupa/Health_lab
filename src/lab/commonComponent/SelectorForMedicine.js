import { Form } from "react-bootstrap";

const SelectorForMedicine = (props) => {
  return (
    <Form.Group>
      <br />
      <Form.Label>{props.label}</Form.Label>
      <select className="form-select" name={props.name} value={props.value} onChange={(e) => {
          props.handleSelect(e.target.value)
      }}>
        <option defaultValue={props.defaultValue}>{props.defaultValue}</option>
        {props.options.map((item) => (
          <option key={item._id}value={item._id}>{item.name}</option>
        ))}
      </select>
    </Form.Group>
  );
};
export default SelectorForMedicine;
