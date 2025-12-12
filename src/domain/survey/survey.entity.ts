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
    public readonly id: string,
    public title: string,
    public description: string,
    public isPublic: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public ownerId?: string | undefined
  ) {}

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
    if (!props.id) throw new Error("Tiene que tener un id.");

    if (!props.title || props.title.trim().length === 0) {
      throw new Error("El titulo no puede estar vacio.");
    }

    if (!props.description || props.description.trim().length === 0) {
      throw new Error("La descripcion no puiede estar vacia.");
    }

    if (!(props.createdAt instanceof Date)) {
      throw new Error("createdAt debe ser del formato Date.");
    }

    if (!(props.updatedAt instanceof Date)) {
      throw new Error("updatedAt debe ser del formato Date.");
    }

    if (props.updatedAt < props.createdAt) {
      throw new Error("updatedAt no puede ser antes que createdAt.");
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
