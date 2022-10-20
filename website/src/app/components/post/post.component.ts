import { Component, Input, OnInit } from '@angular/core'
import { Post } from 'src/app/models/post.model'

@Component({
	selector: 'app-post[post]',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
	@Input() post: Post = { username: '-', content: '-', date: Date.now(), ID: Date.now() }

	constructor() {}

	ngOnInit(): void {}
}
