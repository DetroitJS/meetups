export default function() {

  let list = {};

  //const roster = () => JSON.parse(JSON.stringify(list));
  //const roster = () => ({...list}); // Babel doesn't like
  const roster = () => Object.keys(list).reduce((copy, grade) => {
    copy[grade] = JSON.parse(JSON.stringify(list[grade] || []));
    return copy;
  }, {});

  const add = (name, grade) => {
    list[grade] = list[grade] || [];
    list[grade].push(name);
    list[grade].sort();
  };

  //const grade = (grade) => list[grade] || [];
  //const grade = (grade) => Object.freeze(list[grade] || []); // problem with Jasmine
  //const grade = (grade) => (list[grade] || []).concat();
  //const grade = (grade) => (list[grade] || []).slice();
  //const grade = (grade) => [...(list[grade] || [])];
  const grade = (grade) => JSON.parse(JSON.stringify(list[grade] || []));

  return { roster, add, grade };

}
