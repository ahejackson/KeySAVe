export const knownHelpersBox = {
  moment: true,

  '-is?': true,
  '-and?': true,
  '-or?': true,
  '-not?': true,
  '-gt?': true,
  '-lt?': true,
  '-ge?': true,
  '-le?': true,
  '-ne?': true,
  '-equal?': true,
  '-deep-equal?': true,
  '-in?': true,
  '-has?': true,
  '-empty?': true,
  '-not-empty?': true,
  '-string?': true,
  '-array?': true,

  '-map': true,
  '-sort': true,
  '-take': true,
  '-drop': true,
  '-filter': true,
  '-take-while': true,
  '-drop-while': true,
  '-slice': true,
  '-flatten': true,
  '-deep-flatten': true,
  '-array': true,
  '-range': true,
  '-object': true,
  '-size': true,
  '-find': true,
  '-reduce': true,
  '-first': true,
  '-last': true,
  '-join': true,
  '-sum': true,
  '-product': true,
  '-min': true,
  '-max': true,
  '-group-by': true,
  '-grouped': true,
  '-every?': true,
  '-some?': true,
  '-none?': true,
  '-contain?': true,
  '-union': true,
  '-difference': true,
  '-intersection': true,
  '-distinct': true,
  '-get': true,
  '-keys': true,
  '-values': true,
  '-json': true,
  '-as-is': true,
  '-partial': true,
  '-call': true,
  '-let': true,
  '-log': true,
  'n-even?': true,
  'n-odd?': true,
  'n-add': true,
  'n-subtract': true,
  'n-multiply': true,
  'n-divide': true,
  'n-modulo': true,
  'n-bls': true,
  'n-brs': true,
  'n-brss': true,
  'n-band': true,
  'n-bor': true,
  'n-bxor': true,
  's-size': true,
  's-trim': true,
  's-take': true,
  's-drop': true,
  's-repeat': true,
  's-concat': true,
  's-split': true,
  's-splice': true,
  's-reverse': true,
  's-replace': true,
  's-match': true,
  's-lowercase': true,
  's-uppercase': true,
  's-lowercase?': true,
  's-uppercase?': true,
  's-match?': true,
  's-contain?': true,
  's-start-with?': true,
  's-end-with?': true,
  'f-slash': true,
  'f-join': true,
  'f-split': true,
  'f-dirname': true,
  'f-basename': true,
  'f-extname': true,
  'f-drop-extname': true,
  'f-relative': true
};

export const knownHelpersPokemon = {
  row: true,
  column: true,
  box: true,
  level: true,
  hp: true,
  atk: true,
  def: true,
  spAtk: true,
  spDef: true,
  spe: true,
  speciesName: true,
  hasAlternateForm: true,
  formName: true,
  natureName: true,
  abilityName: true,
  typeName: true,
  moveName: true,
  itemName: true,
  ballName: true,
  metLocationName: true,
  eggLocationName: true,
  ballImage: true,
  esv: true,
  tsv: true,
  tid: true,
  sid: true,
  language: true,
  genderString: true,
  gameVersionString: true,
  stepsToHatch: true,
  hasHa: true,
  checkmark: true,
  pentagon: true,
  shinyMark: true,
  markings: true,
  regionName: true,
  countryName: true,
  ribbons: true,
  characteristic: true,
  espace: true,
  toJson: true,
  eval: true,

  ...knownHelpersBox
}
