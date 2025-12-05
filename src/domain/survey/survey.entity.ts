export class SurveyEntity {
  private constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public isPublic: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public ownerId?: string,
  ) {}

  static create(props: {
    id: string;
    title: string;
    description: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    ownerId?: string | undefined;
  }) {
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
