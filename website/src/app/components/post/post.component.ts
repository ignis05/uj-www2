import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { Post } from 'src/app/models/post.model'
import { BackendService } from 'src/app/services/backend.service'

@Component({
	selector: 'app-post[post]',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
	@Input() post: Post = { username: '-', content: '-', date: Date.now(), ID: Date.now() }
	@Input() canManage: boolean = false
	@Output() postUpdated = new EventEmitter<void>()
	isInEditingMode: boolean = false
	postForm: FormGroup = new FormGroup({
		content: new FormControl('', []),
	})

	constructor(private backend: BackendService) {}

	ngOnInit(): void {
		this.postForm.setValue({ content: this.post.content })
	}

	toggleEditingMode() {
		let newVal = this.postForm.get('content')?.value
		// save changes after editing
		if (this.isInEditingMode || this.post.content !== newVal) {
			this.post.content = newVal
			this.backend.updatePost(this.post.ID, this.post.content).subscribe((data: any) => {
				console.log(data)
				this.postUpdated.emit()
			})
		}
		this.isInEditingMode = !this.isInEditingMode
	}

	removePost() {
		this.backend.removePost(this.post.ID).subscribe((data: any) => {
			console.log(data)
			this.postUpdated.emit()
		})
	}
}
