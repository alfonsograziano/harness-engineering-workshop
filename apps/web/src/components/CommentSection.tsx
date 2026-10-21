import { type FormEvent, useState } from 'react';
import { useComments, useCreateComment } from '../api/comments';
import { formatRelative } from '../lib/dates';
import { Avatar } from './Avatar';
import { ErrorMessage } from './ErrorMessage';

export function CommentSection({ identifier }: { identifier: string }) {
  const comments = useComments(identifier);
  const createComment = useCreateComment(identifier);
  const [body, setBody] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createComment.mutate({ body }, { onSuccess: () => setBody('') });
  }

  return (
    <section className="comments" aria-label="Comments">
      <h3 className="comments__heading">Comments</h3>
      {comments.data?.length === 0 && <p className="muted">No comments yet.</p>}
      <ol className="comments__list">
        {comments.data?.map((comment) => (
          <li key={comment.id} className="comment">
            <Avatar user={comment.author} />
            <div>
              <div className="comment__meta">
                <strong>{comment.author.name}</strong> · {formatRelative(comment.createdAt)}
              </div>
              <p className="comment__body">{comment.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          aria-label="New comment"
          placeholder="Leave a comment…"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={3}
          required
        />
        <button type="submit" className="button button--primary" disabled={createComment.isPending}>
          Comment
        </button>
      </form>
      {createComment.error && <ErrorMessage error={createComment.error} />}
    </section>
  );
}
