import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnvironmentService } from '../../services/environment.service';
import { MatDialog } from '@angular/material';
import { ModalWorkLocalComponent } from '../../components/modals/work-local/modal-work-local.component';

@Component({
  templateUrl: './environment-overview-page.component.html'
})
export class EnvironmentOverviewPageComponent implements OnInit {
  projectId: string;
  environmentId: string;

  constructor(
    private route: ActivatedRoute,
    private environmentService: EnvironmentService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('project_id');
    this.environmentId = this.route.snapshot.paramMap.get('environment_id');
  }

  addDomain() {
    this.environmentService.addDomain(this.environmentId);
  }

  addService() {
    this.environmentService.addService(this.environmentId);
  }

  clickWorkLocal() {
    const dialogRef = this.dialog.open(ModalWorkLocalComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
