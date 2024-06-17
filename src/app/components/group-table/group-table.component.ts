import { Component, Input } from '@angular/core';
import { GroupTable } from '../../models/group-table/group-table';
import { ScoresListComponent } from '../scores-list/scores-list.component';

@Component({
  selector: 'app-group-table',
  standalone: true,
  imports: [ScoresListComponent],
  templateUrl: './group-table.component.html',
  styleUrl: './group-table.component.scss'
})
export class GroupTableComponent {
  @Input() groupTable: GroupTable | undefined;
}
