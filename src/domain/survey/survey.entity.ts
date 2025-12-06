export interface SurveyProps {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId?: string | undefined;
}

export class SurveyEntity {
  private constructor(
    private readonly id: string,
    private title: string,
    private description: string,
    private isPublic: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private ownerId?: string | undefined
  ) {}

  getId() {
    return this.id;
  }
  getTitle() {
    return this.title;
  }
  getDescription() {
    return this.description;
  }
  getIsPublic() {
    return this.isPublic;
  }
  getCreatedAt() {
    return this.createdAt;
  }
  getUpdatedAt() {
    return this.updatedAt;
  }
  getOwnerId() {
    return this.ownerId;
  }

  changeTitle(newTitle: string) {
    if (!newTitle || newTitle.length === 0) {
      throw new Error("Title cannot be empty.");
    }
    this.title = newTitle;
    this.touch();
  }

  changeDescription(newDescription: string) {
    if (!newDescription || newDescription.length === 0) {
      throw new Error("Description cannot be empty.");
    }
    this.description = newDescription;
    this.touch();
  }

  changeVisibility(isPublic: boolean) {
    this.isPublic = isPublic;
    this.touch();
  }

  private touch() {
    this.updatedAt = new Date();
  }

  private static validate(props: SurveyProps) {
    if (!props.id) throw new Error("Survey must have an ID.");

    if (!props.title || props.title.trim().length === 0) {
      throw new Error("Survey title cannot be empty.");
    }

    if (!props.description || props.description.trim().length === 0) {
      throw new Error("Survey description cannot be empty.");
    }

    if (!(props.createdAt instanceof Date)) {
      throw new Error("createdAt must be a Date instance.");
    }

    if (!(props.updatedAt instanceof Date)) {
      throw new Error("updatedAt must be a Date instance.");
    }

    if (props.updatedAt < props.createdAt) {
      throw new Error("updatedAt cannot be earlier than createdAt.");
    }
  }

  static create(props: SurveyProps) {
    SurveyEntity.validate(props);

    return new SurveyEntity(
      props.id,
      props.title,
      props.description,
      props.isPublic,
      props.createdAt,
      props.updatedAt,
      props.ownerId
    );
  }
}
