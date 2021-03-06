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
import AssigneeFacet from './AssigneeFacet';
import AuthorFacet from './AuthorFacet';
import CreationDateFacet from './CreationDateFacet';
import DirectoryFacet from './DirectoryFacet';
import FileFacet from './FileFacet';
import LanguageFacet from './LanguageFacet';
import ModuleFacet from './ModuleFacet';
import ProjectFacet from './ProjectFacet';
import ResolutionFacet from './ResolutionFacet';
import RuleFacet from './RuleFacet';
import SeverityFacet from './SeverityFacet';
import StandardFacet from './StandardFacet';
import StatusFacet from './StatusFacet';
import TagFacet from './TagFacet';
import TypeFacet from './TypeFacet';
import {
  Query,
  Facet,
  ReferencedComponent,
  ReferencedUser,
  ReferencedLanguage,
  STANDARDS
} from '../utils';
import { Component } from '../../../app/types';

export interface Props {
  component: Component | undefined;
  facets: { [facet: string]: Facet };
  loading?: boolean;
  loadingFacets: { [key: string]: boolean };
  myIssues: boolean;
  onFacetToggle: (property: string) => void;
  onFilterChange: (changes: Partial<Query>) => void;
  openFacets: { [facet: string]: boolean };
  organization: { key: string } | undefined;
  query: Query;
  referencedComponents: { [componentKey: string]: ReferencedComponent };
  referencedLanguages: { [languageKey: string]: ReferencedLanguage };
  referencedRules: { [ruleKey: string]: { name: string } };
  referencedUsers: { [login: string]: ReferencedUser };
}

export default class Sidebar extends React.PureComponent<Props> {
  render() {
    const { component, facets, openFacets, query } = this.props;

    const displayProjectsFacet =
      !component || !['TRK', 'BRC', 'DIR', 'DEV_PRJ'].includes(component.qualifier);
    const displayModulesFacet = component !== undefined && component.qualifier !== 'DIR';
    const displayDirectoriesFacet = component !== undefined && component.qualifier !== 'DIR';
    const displayFilesFacet = component !== undefined;
    const displayAuthorFacet = !component || component.qualifier !== 'DEV';

    const organizationKey =
      (component && component.organization) ||
      (this.props.organization && this.props.organization.key);

    return (
      <div className="search-navigator-facets-list">
        <TypeFacet
          fetching={this.props.loadingFacets.types === true}
          loading={this.props.loading}
          onChange={this.props.onFilterChange}
          onToggle={this.props.onFacetToggle}
          open={!!openFacets.types}
          stats={facets.types}
          types={query.types}
        />
        <SeverityFacet
          fetching={this.props.loadingFacets.severities === true}
          loading={this.props.loading}
          onChange={this.props.onFilterChange}
          onToggle={this.props.onFacetToggle}
          open={!!openFacets.severities}
          severities={query.severities}
          stats={facets.severities}
        />
        <ResolutionFacet
          fetching={this.props.loadingFacets.resolutions === true}
          loading={this.props.loading}
          onChange={this.props.onFilterChange}
          onToggle={this.props.onFacetToggle}
          open={!!openFacets.resolutions}
          resolutions={query.resolutions}
          resolved={query.resolved}
          stats={facets.resolutions}
        />
        <StatusFacet
          fetching={this.props.loadingFacets.statuses === true}
          loading={this.props.loading}
          onChange={this.props.onFilterChange}
          onToggle={this.props.onFacetToggle}
          open={!!openFacets.statuses}
          stats={facets.statuses}
          statuses={query.statuses}
        />
        <CreationDateFacet
          component={component}
          createdAfter={query.createdAfter}
          createdAt={query.createdAt}
          createdBefore={query.createdBefore}
          createdInLast={query.createdInLast}
          fetching={this.props.loadingFacets.createdAt === true}
          loading={this.props.loading}
          onChange={this.props.onFilterChange}
          onToggle={this.props.onFacetToggle}
          open={!!openFacets.createdAt}
          sinceLeakPeriod={query.sinceLeakPeriod}
          stats={facets.createdAt}
        />
        <LanguageFacet
          fetching={this.props.loadingFacets.languages === true}
          languages={query.languages}
          loading={this.props.loading}
          onChange={this.props.onFilterChange}
          onToggle={this.props.onFacetToggle}
          open={!!openFacets.languages}
          referencedLanguages={this.props.referencedLanguages}
          stats={facets.languages}
        />
        <RuleFacet
          fetching={this.props.loadingFacets.rules === true}
          languages={query.languages}
          loading={this.props.loading}
          onChange={this.props.onFilterChange}
          onToggle={this.props.onFacetToggle}
          open={!!openFacets.rules}
          organization={organizationKey}
          referencedRules={this.props.referencedRules}
          rules={query.rules}
          stats={facets.rules}
        />
        <StandardFacet
          cwe={query.cwe}
          cweOpen={!!openFacets.cwe}
          cweStats={facets.cwe}
          fetchingCwe={this.props.loadingFacets.cwe === true}
          fetchingOwaspTop10={this.props.loadingFacets.owaspTop10 === true}
          fetchingSansTop25={this.props.loadingFacets.sansTop25 === true}
          loading={this.props.loading}
          onChange={this.props.onFilterChange}
          onToggle={this.props.onFacetToggle}
          open={!!openFacets[STANDARDS]}
          owaspTop10={query.owaspTop10}
          owaspTop10Open={!!openFacets.owaspTop10}
          owaspTop10Stats={facets.owaspTop10}
          sansTop25={query.sansTop25}
          sansTop25Open={!!openFacets.sansTop25}
          sansTop25Stats={facets.sansTop25}
        />
        <TagFacet
          component={component}
          fetching={this.props.loadingFacets.tags === true}
          loading={this.props.loading}
          onChange={this.props.onFilterChange}
          onToggle={this.props.onFacetToggle}
          open={!!openFacets.tags}
          organization={organizationKey}
          stats={facets.tags}
          tags={query.tags}
        />
        {displayProjectsFacet && (
          <ProjectFacet
            component={component}
            fetching={this.props.loadingFacets.projects === true}
            loading={this.props.loading}
            onChange={this.props.onFilterChange}
            onToggle={this.props.onFacetToggle}
            open={!!openFacets.projects}
            organization={this.props.organization}
            projects={query.projects}
            referencedComponents={this.props.referencedComponents}
            stats={facets.projects}
          />
        )}
        {displayModulesFacet && (
          <ModuleFacet
            fetching={this.props.loadingFacets.modules === true}
            loading={this.props.loading}
            modules={query.modules}
            onChange={this.props.onFilterChange}
            onToggle={this.props.onFacetToggle}
            open={!!openFacets.modules}
            referencedComponents={this.props.referencedComponents}
            stats={facets.modules}
          />
        )}
        {displayDirectoriesFacet && (
          <DirectoryFacet
            directories={query.directories}
            fetching={this.props.loadingFacets.directories === true}
            loading={this.props.loading}
            onChange={this.props.onFilterChange}
            onToggle={this.props.onFacetToggle}
            open={!!openFacets.directories}
            referencedComponents={this.props.referencedComponents}
            stats={facets.directories}
          />
        )}
        {displayFilesFacet && (
          <FileFacet
            fetching={this.props.loadingFacets.files === true}
            files={query.files}
            loading={this.props.loading}
            onChange={this.props.onFilterChange}
            onToggle={this.props.onFacetToggle}
            open={!!openFacets.files}
            referencedComponents={this.props.referencedComponents}
            stats={facets.files}
          />
        )}
        {!this.props.myIssues && (
          <AssigneeFacet
            assigned={query.assigned}
            assignees={query.assignees}
            component={component}
            fetching={this.props.loadingFacets.assignees === true}
            loading={this.props.loading}
            onChange={this.props.onFilterChange}
            onToggle={this.props.onFacetToggle}
            open={!!openFacets.assignees}
            organization={organizationKey}
            referencedUsers={this.props.referencedUsers}
            stats={facets.assignees}
          />
        )}
        {displayAuthorFacet && (
          <AuthorFacet
            authors={query.authors}
            fetching={this.props.loadingFacets.authors === true}
            loading={this.props.loading}
            onChange={this.props.onFilterChange}
            onToggle={this.props.onFacetToggle}
            open={!!openFacets.authors}
            stats={facets.authors}
          />
        )}
      </div>
    );
  }
}
