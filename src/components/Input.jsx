/* eslint-disable react/prop-types */

export const Input = ({ name, value, unit, min, max, onChange }) => {
  return (
    <>
      <label><p>{String(name).toUpperCase()}:</p> {value}{unit}</label>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(event.target.name, event.target.value)}
      />
    </>
  );
};
