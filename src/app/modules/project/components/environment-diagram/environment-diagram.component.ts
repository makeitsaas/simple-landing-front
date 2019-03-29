import { Component, Input, OnInit } from '@angular/core';
import { EnvironmentService } from '../../services/environment.service';

@Component({
  selector: 'app-environment-diagram',
  templateUrl: './environment-diagram.component.html',
  styleUrls: ['./environment-diagram.component.scss']
})
export class EnvironmentDiagramComponent implements OnInit {

  domains = [];
  services = [];

  @Input() environmentId: string;

  constructor(
    private environmentService: EnvironmentService
  ) {}

  ngOnInit() {
    this.environmentService.getEnvironment(this.environmentId).subscribe(environment => {
      this.domains = environment.domains;
      this.services = environment.services;
    });
  }

}
