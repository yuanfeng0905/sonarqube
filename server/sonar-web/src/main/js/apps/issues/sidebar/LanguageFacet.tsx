/*
 * SonarQube
 * Copyright (C) 2009-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import * as React from 'react';
import { sortBy, uniq, without } from 'lodash';
import LanguageFacetFooter from './LanguageFacetFooter';
import { formatFacetStat, Query, ReferencedLanguage } from '../utils';
import FacetBox from '../../../components/facet/FacetBox';
import FacetHeader from '../../../components/facet/FacetHeader';
import FacetItem from '../../../components/facet/FacetItem';
import FacetItemsList from '../../../components/facet/FacetItemsList';
import { translate } from '../../../helpers/l10n';
import DeferredSpinner from '../../../components/common/DeferredSpinner';

interface Props {
  fetching: boolean;
  languages: string[];
  loading?: boolean;
  onChange: (changes: Partial<Query>) => void;
  onToggle: (property: string) => void;
  open: boolean;
  referencedLanguages: { [languageKey: string]: ReferencedLanguage };
  stats: { [x: string]: number } | undefined;
}

export default class LanguageFacet extends React.PureComponent<Props> {
  property = 'languages';

  static defaultProps = {
    open: true
  };

  handleItemClick = (itemValue: string, multiple: boolean) => {
    const { languages } = this.props;
    if (multiple) {
      const newValue = sortBy(
        languages.includes(itemValue) ? without(languages, itemValue) : [...languages, itemValue]
      );
      this.props.onChange({ [this.property]: newValue });
    } else {
      this.props.onChange({
        [this.property]: languages.includes(itemValue) && languages.length < 2 ? [] : [itemValue]
      });
    }
  };

  handleHeaderClick = () => {
    this.props.onToggle(this.property);
  };

  handleClear = () => {
    this.props.onChange({ [this.property]: [] });
  };

  getLanguageName(language: string) {
    const { referencedLanguages } = this.props;
    return referencedLanguages[language] ? referencedLanguages[language].name : language;
  }

  getStat(language: string) {
    const { stats } = this.props;
    return stats ? stats[language] : undefined;
  }

  handleSelect = (language: string) => {
    const { languages } = this.props;
    this.props.onChange({ [this.property]: uniq([...languages, language]) });
  };

  renderList() {
    const { stats } = this.props;

    if (!stats) {
      return null;
    }

    const languages = sortBy(Object.keys(stats), key => -stats[key]);

    return (
      <FacetItemsList>
        {languages.map(language => (
          <FacetItem
            active={this.props.languages.includes(language)}
            key={language}
            loading={this.props.loading}
            name={this.getLanguageName(language)}
            onClick={this.handleItemClick}
            stat={formatFacetStat(this.getStat(language))}
            tooltip={this.props.languages.length === 1 && !this.props.languages.includes(language)}
            value={language}
          />
        ))}
      </FacetItemsList>
    );
  }

  renderFooter() {
    if (!this.props.stats) {
      return null;
    }

    return (
      <LanguageFacetFooter onSelect={this.handleSelect} selected={Object.keys(this.props.stats)} />
    );
  }

  render() {
    const values = this.props.languages.map(language => this.getLanguageName(language));
    return (
      <FacetBox property={this.property}>
        <FacetHeader
          name={translate('issues.facet', this.property)}
          onClear={this.handleClear}
          onClick={this.handleHeaderClick}
          open={this.props.open}
          values={values}
        />

        <DeferredSpinner loading={this.props.fetching} />
        {this.props.open && this.renderList()}
        {this.props.open && this.renderFooter()}
      </FacetBox>
    );
  }
}
