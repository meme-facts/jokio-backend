import { StatusEnum } from "@modules/posts/enums/StatusEnum";
import { celebrate, Joi, Segments } from "celebrate";

const UpdateFollowersStatusValidator = celebrate({
  [Segments.QUERY]: {
    id: Joi.string().uuid().required(),
    status: Joi.string().valid(
      ...Object.keys(StatusEnum).map((e) => StatusEnum[e])
    ),
  },
});

export { UpdateFollowersStatusValidator };
