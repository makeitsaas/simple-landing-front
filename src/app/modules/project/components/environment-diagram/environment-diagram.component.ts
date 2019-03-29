import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-environment-diagram',
  templateUrl: './environment-diagram.component.html',
  styleUrls: ['./environment-diagram.component.scss']
})
export class EnvironmentDiagramComponent {

  domains = [
    'project.makeitsaas.com',
  ];

  services = [
    {name: 'Authentication', subpath: '/auth'},
    {name: 'Subscriptions', subpath: '/subscription'},
    {name: 'Custom', subpath: '/custom'}
  ];

  @Input() environmentId: string;

  constructor() {}

}
