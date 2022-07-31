import './Form.css';

export const Form = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <input className="form-control" id="name" placeholder='Name' />
      </div>
      <div className="form-group">
        <button className="form-control-btn-btn-primary" type="submit">
          Save score
        </button>
      </div>
    </form>
  );
};
export default Form;
