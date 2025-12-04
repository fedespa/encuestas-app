export class SurveyEntity {
  private constructor(
    public readonly id: string,
    public ownerId: string,
    public title: string,
    public description: string,
    public isPublic: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(props: {
    id: string;
    ownerId: string;
    title: string;
    description: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new SurveyEntity(
      props.id,
      props.ownerId,
      props.title,
      props.description,
      props.isPublic,
      props.createdAt,
      props.updatedAt
    );
  }
}
