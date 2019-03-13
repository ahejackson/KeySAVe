import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Seq } from 'immutable';
import { openFile, dismissError } from '../actions/file';
import { setFilterBv, setFilterSav } from '../actions/filter';
import { openDialog } from '../actions/dialog';
import makeCached from '../utils/makeCachedFunction';
import Dumping from '../components/Dumping';

const getActiveTeamSelector = createSelector(
  state => state.file.type,
  state => state.filter.teamSelected,
  state => state.file.keyProperties,
  (type, teamSelected, keyProperties) => {
    if (type !== 'BV') return -1;
    if (keyProperties[teamSelected]) return teamSelected;
    for (let i = 0; i < keyProperties.length; ++i) {
      if (keyProperties[i]) return i;
    }
    return -1;
  }
);

const getPokemonSeq = createSelector(
  state => state.file.pokemon,
  state => state.file.type,
  getActiveTeamSelector,
  (pokemon, type, activeTeam) =>
    type === 'SAV' ? new Seq(pokemon) : type === 'BV' ? new Seq(pokemon[activeTeam]) : new Seq()
);

const getSvList = createSelector(
  state => state.filter.svs,
  svs => (svs.match(/\b\d{1,4}\b/g) || []).map(sv => parseInt(sv, 10))
);

const getFilter = createSelector(
  state => state.filter,
  state => state.file.type,
  getSvList,
  (filter, type, svList) => {
    return makeCached(pkm => {
      if (
        type === 'SAV' &&
        ((filter.lower !== undefined && filter.lower > pkm.box + 1) ||
          (filter.upper !== undefined && filter.upper < pkm.box + 1))
      )
        return false;
      if (!filter.enabled) return true;
      if (filter.eggsOnly && !pkm.isEgg) return false;
      const shinyCond =
        (!pkm.isEgg && pkm.isShiny) ||
        (pkm.isEgg && ((filter.eggsHaveMySv && pkm.tsv === pkm.esv) || svList.includes(pkm.esv)));
      if (shinyCond && filter.shinyOverride) return true;
      if (!shinyCond && filter.shiniesOnly) return false;
      if (filter.gender !== '3' && filter.gender !== '' + pkm.gender) return false;
      if (filter.haOnly && pkm.abilityNum !== 4) return false;
      let needPerfects = filter.numPerfectIvs;
      const ivCompVal = Math.min(filter.hpTypes.length, 1);
      for (const [Iv, iv] of [
        ['Hp', 'hp'],
        ['Def', 'def'],
        ['SpAtk', 'spAtk'],
        ['SpDef', 'spDef'],
      ]) {
        const val = pkm['iv' + Iv];
        if (31 - val <= ivCompVal) --needPerfects;
        else if (filter.ivs[iv]) return false;
      }
      if (
        (filter.specialAttacker && pkm.ivAtk <= ivCompVal) ||
        (!filter.specialAttacker && 31 - pkm.ivAtk <= ivCompVal)
      )
        --needPerfects;
      else if (filter.ivs.atk) return false;
      if (
        (filter.trickroom && pkm.ivSpe <= ivCompVal) ||
        (!filter.trickroom && 31 - pkm.ivSpe <= ivCompVal)
      )
        --needPerfects;
      else if (filter.ivs.spe) return false;
      if (needPerfects > 0) return false;
      if (filter.hpTypes.length && filter.hpTypes.find(value => value === pkm.hpType) === undefined)
        return false;
      if (
        filter.species.length &&
        filter.species.find(value => value === pkm.species) === undefined
      )
        return false;
      if (filter.natures.length && filter.natures.find(value => value === pkm.nature) === undefined)
        return false;
      if (
        filter.abilities.length &&
        filter.abilities.find(value => value === pkm.ability) === undefined
      )
        return false;
      if (filter.customFilter) {
        try {
          return filter.customFilter(pkm);
        } catch (e) {
          return false;
        }
      }

      if (
        filter.orgMovesPPMax &&
        (pkm.move1Ppu === 3 && pkm.move2Ppu === 3 && pkm.move3Ppu === 3 && pkm.move4Ppu === 3)
      ) {
        return false;
      }

      if (filter.orgMarkingsCorrect) {
        if (
          pkm.version === 6 &&
          (pkm.ivHp === 31) === ((pkm.markings & 0x01) === 0x01) &&
          (pkm.ivAtk === 31) === ((pkm.markings & 0x02) === 0x02) &&
          (pkm.ivDef === 31) === ((pkm.markings & 0x04) === 0x04) &&
          (pkm.ivSpAtk === 31) === ((pkm.markings & 0x08) === 0x08) &&
          (pkm.ivSpDef === 31) === ((pkm.markings & 0x10) === 0x10) &&
          (pkm.ivSpe === 31) === ((pkm.markings & 0x20) === 0x20)
        ) {
          return false;
        }

        if (
          (pkm.ivHp === 31) === (((pkm.markings >>> (0 << 1)) & 3) === 1) &&
          (pkm.ivAtk === 31) === (((pkm.markings >>> (1 << 1)) & 3) === 1) &&
          (pkm.ivDef === 31) === (((pkm.markings >>> (2 << 1)) & 3) === 1) &&
          (pkm.ivSpAtk === 31) === (((pkm.markings >>> (3 << 1)) & 3) === 1) &&
          (pkm.ivSpDef === 31) === (((pkm.markings >>> (4 << 1)) & 3) === 1) &&
          (pkm.ivSpe === 31) === (((pkm.markings >>> (5 << 1)) & 3) === 1) &&
          pkm.htHp === (((pkm.markings >>> (0 << 1)) & 3) === 2) &&
          pkm.htAtk === (((pkm.markings >>> (1 << 1)) & 3) === 2) &&
          pkm.htDef === (((pkm.markings >>> (2 << 1)) & 3) === 2) &&
          pkm.htSpAtk === (((pkm.markings >>> (3 << 1)) & 3) === 2) &&
          pkm.htSpDef === (((pkm.markings >>> (4 << 1)) & 3) === 2) &&
          pkm.htSpe === (((pkm.markings >>> (5 << 1)) & 3) === 2)
        ) {
          return false;
        }
      }

      return true;
    });
  }
);

const mapStateToProps = createSelector(
  getPokemonSeq,
  getFilter,
  state => state.file.name,
  state => state.file.keyProperties,
  state => state.file.generation,
  state => state.file.error,
  state => state.file.type,
  state => state.filter,
  state => state.format,
  (pokemon, filterFunction, name, keyProperties, generation, error, type, filter, format) => ({
    pokemon,
    filterFunction,
    name,
    keyProperties,
    generation,
    error,
    type,
    filter,
    format,
  })
);

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { openFile, dismissError, setFilterSav, setFilterBv, openDialog },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Dumping);
