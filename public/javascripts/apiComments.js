document.querySelector("#send-comment").addEventListener("click", async event => {
	event.preventDefault();
	// Call POST /api/comments
	const commentInputElement = document.querySelector('#content')
	const addCommentForm = document.querySelector('#add-comment-form')
	const formData = new FormData(addCommentForm)
	const content = formData.get('content').trim();
	const csrf = formData.get('_csrf')
	const extensionId = window.location.href.split("/")[4];
	let res = await fetch("/api/comments", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			content,
			extensionId,
			_csrf: csrf
		})
	})

	const data = await res.json();
	if (!data.error) {
		const { username, profileURL } = data;
		const contentContainer = document.querySelector('#content-container')
		const commentLi = document.createElement('li');
		commentLi.classList.add("comment-li");
		const commenterImg = document.createElement('img');
		commenterImg.setAttribute("src", profileURL);
		commenterImg.classList.add("comment-avatar-img");
		commentLi.appendChild(commenterImg);
		const usernameElement = document.createElement("h2");
		usernameElement.classList.add("comment-username");
		usernameElement.innerText = username;
		commentLi.appendChild(usernameElement);
		const contentElement = document.createElement("span");
		contentElement.classList.add("comment-content");
		contentElement.id=`comment-edit${data.id}`
		contentElement.innerText = content;
		commentInputElement.value = ''

		const commentDiv = document.createElement('div');
		commentDiv.classList.add("comment-btns")

		const submitBtn = document.createElement("button");
		submitBtn.classList.add("comment-edit-submit-btn");
		submitBtn.id=`comment-edit-submit-btn${data.id}`;
		submitBtn.setAttribute("hidden", "");

		const cancelBtn = document.createElement("button");
		cancelBtn.classList.add("comment-delete-cancel-btn");
		cancelBtn.id=`comment-delete-cancel-btn${data.id}`;
		cancelBtn.setAttribute("hidden", "")
		cancelBtn.innerText='Cancel';
		cancelBtn.addEventListener("click", function() {
			cancelBtn.setAttribute("hidden", "");
			deleteBtn.setAttribute("hidden", "");
			dTag.classList.remove("hidden");
			eTag.classList.remove("hidden");
		});

		const deleteBtn = document.createElement("button");
		deleteBtn.classList.add("comment-delete-submit-btn");
		deleteBtn.id =`comment-delete-submit-btn${data.id}`;
		deleteBtn.setAttribute("hidden", "")
		deleteBtn.innerHTML="Delete";
		deleteBtn.addEventListener("click", function() {
			commentLi.style.display = 'none';
			deleteComment(`#comment${data.id}`, data.id)
		})

		const eTag = document.createElement('i');
		eTag.classList.add("fa");
		eTag.classList.add("fa-pencil");
		eTag.classList.add("edit-comment-btn");
		eTag.ariaHidden="true";
		eTag.addEventListener("click", function() {
			contentElement.classList.add("comment-edit-input");
			contentElement.setAttribute("contenteditable", "true");
			submitBtn.removeAttribute("hidden");
			submitBtn.innerText = "Edit";
			submitBtn.addEventListener("click", function() {
				submitEdit(data.id)
			})
		})

		const dTag = document.createElement('i');
		dTag.classList.add("fa")
		dTag.classList.add("fa-trash")
		dTag.classList.add("delete-comment-btn")
		dTag.ariaHidden="true";
		dTag.addEventListener("click", function() {
			deleteBtn.removeAttribute("hidden", "");
			cancelBtn.removeAttribute("hidden", "");
			dTag.classList.add("hidden");
			eTag.classList.add("hidden");
		})

		commentLi.append(submitBtn);
		commentLi.append(deleteBtn);
		commentLi.append(cancelBtn);
		commentDiv.appendChild(eTag);
		commentDiv.appendChild(dTag);
		commentLi.appendChild(commentDiv);
		commentLi.appendChild(contentElement);
		contentContainer.appendChild(commentLi)
	} else {
		// display errors dynamically
		console.log(data.error);
		// document.querySelector("#comment-errors").appendChild(); //TODO #62 create dispaly for comment error message
	}
})
