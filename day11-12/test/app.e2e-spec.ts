import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Episode } from 'src/podcast/entities/episode.entity';

const GRAPHQL_ENDPOINT = '/graphql';

const TEST_USER = {
  email: 'test@test.com',
  password: '12345',
};

const TEST_PODCAST: Podcast = {
  id: 1,
  title: 'TEST',
  category: 'TEST',
  rating: 0,
  episodes: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const TEST_EPISODE: Episode = {
  id: 1,
  title: 'TEST',
  category: 'TEST',
  createdAt: new Date(),
  updatedAt: new Date(),
  podcast: TEST_PODCAST,
};

describe('App (e2e)', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let podcastsRepository: Repository<Podcast>;
  let jwtToken: string;

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string) => baseTest().send({ query });
  const privateTest = (query: string) =>
    baseTest().set('X-JWT', jwtToken).send({ query });

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    podcastsRepository = module.get<Repository<Podcast>>(
      getRepositoryToken(Podcast),
    );
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  });

  describe('Users Resolver', () => {
    describe('createAccount', () => {
      it('should create account', () => {
        return publicTest(`mutation {
          createAccount(input: {
            email:"${TEST_USER.email}"
            password:"${TEST_USER.password}"
            role:Host
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error } = res.body.data.createAccount;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });

      it('should fail if account already exists', () => {
        return publicTest(`mutation {
          createAccount(input: {
            email:"${TEST_USER.email}"
            password:"${TEST_USER.password}"
            role:Host
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error } = res.body.data.createAccount;
            expect(ok).toBe(false);
            expect(error).toBe('There is a user with that email already');
          });
      });
    });

    describe('login', () => {
      it('should login with correct credentials', () => {
        return publicTest(`mutation {
          login(input: {
            email:"${TEST_USER.email}"
            password:"${TEST_USER.password}"
          }) {
            ok
            error
            token
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error, token } = res.body.data.login;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(token).toEqual(expect.any(String));
            jwtToken = token;
          });
      });

      it('should not be able to login with wrong credentials', () => {
        return publicTest(`mutation {
          login(input: {
            email:"${TEST_USER.email}"
            password:"123123"
          }) {
            ok
            error
            token
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error, token } = res.body.data.login;
            expect(ok).toBe(false);
            expect(error).toBe('Wrong password');
            expect(token).toBe(null);
          });
      });
    });

    describe('me', () => {
      it('should find my profile', () => {
        return privateTest(`{
          me {
            email
          }
        }`)
          .expect(200)
          .expect(res => {
            const { email } = res.body.data.me;
            expect(email).toBe(TEST_USER.email);
          });
      });

      it('should not allow logged out user', () => {
        return publicTest(`{
          me {
            email
          }
        }`)
          .expect(200)
          .expect(res => {
            const { errors } = res.body;
            const [error] = errors;
            expect(error.message).toBe('Forbidden resource');
          });
      });
    });

    describe('seeProfile', () => {
      let userId: number;
      beforeAll(async () => {
        const [user] = await usersRepository.find();
        userId = user.id;
      });

      it("should see a user's profile", () => {
        return privateTest(`{
          seeProfile(userId:${userId}) {
            ok
            error
            user {
              id
            }
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error, user } = res.body.data.seeProfile;
            const { id } = user;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(id).toBe(userId);
          });
      });

      it('should not find a profile', () => {
        return privateTest(`{
          seeProfile(userId:999) {
            ok
            error
            user {
              id
            }
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error, user } = res.body.data.seeProfile;
            expect(ok).toBe(false);
            expect(error).toBe('User Not Found');
            expect(user).toBe(null);
          });
      });
    });

    describe('editProfile', () => {
      const NEW_EMAIL = 'test@new.com';
      it('should change email', () => {
        return privateTest(`mutation {
          editProfile(input: {
            email: "${NEW_EMAIL}"
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error } = res.body.data.editProfile;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });

      it('should have new email', () => {
        return privateTest(`{
          me {
            email
          }
        }`)
          .expect(200)
          .expect(res => {
            const { email } = res.body.data.me;
            expect(email).toBe(NEW_EMAIL);
          });
      });
    });
  });

  describe('Podcasts Resolver', () => {
    describe('createPodcast', () => {
      it('should create a podcast', () => {
        return privateTest(`mutation {
          createPodcast(input: {
            title: "${TEST_PODCAST.title}"
            category: "${TEST_PODCAST.category}"
          }) {
            ok
            error
            id
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error, id } = res.body.data.createPodcast;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            TEST_PODCAST.id = id;
          });
      });
    });

    describe('getAllPodcasts', () => {
      let allPodcasts: Podcast[];
      beforeAll(async () => {
        allPodcasts = await podcastsRepository.find({ select: ['id'] });
      });

      it('should find podcasts', () => {
        return publicTest(`{
          getAllPodcasts {
            ok
            error
            podcasts {
              id
            }
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error, podcasts } = res.body.data.getAllPodcasts;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(podcasts[0].id).toBe(allPodcasts[0].id);
          });
      });
    });

    describe('getPodcast', () => {
      it('should find a podcast', () => {
        return publicTest(`{
          getPodcast(input: {
            id: ${TEST_PODCAST.id}
          }) {
            ok
            error
            podcast {
              id
              title
              category
            }
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error, podcast } = res.body.data.getPodcast;
            const { id, title, category } = podcast;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(id).toBe(TEST_PODCAST.id);
            expect(title).toBe(TEST_PODCAST.title);
            expect(category).toBe(TEST_PODCAST.category);
          });
      });

      it('should fail if not find a podcast', () => {
        return publicTest(`{
          getPodcast(input: {
            id: 999
          }) {
            ok
            error
            podcast {
              id
              title
              category
            }
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error, podcast } = res.body.data.getPodcast;
            expect(ok).toBe(false);
            expect(error).toBe('Podcast with id 999 not found');
            expect(podcast).toBe(null);
          });
      });
    });

    describe('updatePodcast', () => {
      const NEW_RATING = 5;
      it('should update a podcast', () => {
        return privateTest(`mutation {
          updatePodcast(input: {
            id: ${TEST_PODCAST.id}
            payload: {
              rating: ${NEW_RATING}
            }
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error } = res.body.data.updatePodcast;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });

      it('should have new rating', () => {
        return publicTest(`{
          getPodcast(input: {
            id: ${TEST_PODCAST.id}
          }) {
            ok
            error
            podcast {
              id
              rating
            }
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error, podcast } = res.body.data.getPodcast;
            const { id, rating } = podcast;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(id).toBe(TEST_PODCAST.id);
            expect(rating).toBe(NEW_RATING);
          });
      });

      it('should fail if rating is above the range', () => {
        return privateTest(`mutation {
          updatePodcast(input: {
            id: ${TEST_PODCAST.id}
            payload: {
              rating: ${NEW_RATING * 2}
            }
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error } = res.body.data.updatePodcast;
            expect(ok).toBe(false);
            expect(error).toBe('Rating must be between 1 and 5.');
          });
      });
    });

    describe('createEpisode', () => {
      it('should create a episode', () => {
        return privateTest(`mutation {
          createEpisode(input: {
            title: "${TEST_EPISODE.title}"
            category: "${TEST_EPISODE.category}"
            podcastId: ${TEST_EPISODE.id}
          }) {
            ok
            error
            id
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error, id } = res.body.data.createEpisode;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            TEST_EPISODE.id = id;
          });
      });

      it('should fail if not find a podcast', () => {
        return privateTest(`mutation {
          createEpisode(input: {
            title: "${TEST_EPISODE.title}"
            category: "${TEST_EPISODE.category}"
            podcastId: 999
          }) {
            ok
            error
            id
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error, id } = res.body.data.createEpisode;
            expect(ok).toBe(false);
            expect(error).toBe('Podcast with id 999 not found');
            expect(id).toBe(null);
          });
      });
    });

    describe('getEpisodes', () => {
      it('should find episodes', () => {
        return publicTest(`{
          getEpisodes(input: {
            id: ${TEST_PODCAST.id}
          }) {
            ok
            error
            episodes {
              title
              category
            }
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error, episodes } = res.body.data.getEpisodes;
            const { title, category } = episodes[0];
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(title).toBe(TEST_EPISODE.title);
            expect(category).toBe(TEST_EPISODE.category);
          });
      });

      it('should fail if not find a podcast', () => {
        return publicTest(`{
          getEpisodes(input: {
            id: 999
          }) {
            ok
            error
            episodes {
              title
              category
            }
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error, episodes } = res.body.data.getEpisodes;
            expect(ok).toBe(false);
            expect(error).toBe('Podcast with id 999 not found');
            expect(episodes).toBe(null);
          });
      });
    });

    describe('updateEpisode', () => {
      const NEW_EPISODE = {
        title: 'NEW_TITLE',
        category: 'NEW_CATEGORY',
      };
      it('should update a episode', () => {
        return privateTest(`mutation {
          updateEpisode(input: {
            podcastId: ${TEST_PODCAST.id}
            episodeId: ${TEST_EPISODE.id}
            title: "${NEW_EPISODE.title}"
            category: "${NEW_EPISODE.category}"
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error } = res.body.data.updateEpisode;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });

      it('should have new title and category', () => {
        return publicTest(`{
          getEpisodes(input: {
            id: ${TEST_PODCAST.id}
          }) {
            ok
            error
            episodes {
              title
              category
            }
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error, episodes } = res.body.data.getEpisodes;
            const { title, category } = episodes[0];
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(title).toBe(NEW_EPISODE.title);
            expect(category).toBe(NEW_EPISODE.category);
          });
      });

      it('should fail if not find a podcast', () => {
        return privateTest(`mutation {
          updateEpisode(input: {
            podcastId: 999
            episodeId: ${TEST_EPISODE.id}
            title: "${NEW_EPISODE.title}"
            category: "${NEW_EPISODE.category}"
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error } = res.body.data.updateEpisode;
            expect(ok).toBe(false);
            expect(error).toBe('Podcast with id 999 not found');
          });
      });

      it('should fail if not find a episode', () => {
        return privateTest(`mutation {
          updateEpisode(input: {
            podcastId: ${TEST_PODCAST.id}
            episodeId: 999
            title: "${NEW_EPISODE.title}"
            category: "${NEW_EPISODE.category}"
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error } = res.body.data.updateEpisode;
            expect(ok).toBe(false);
            expect(error).toBe(
              'Episode with id 999 not found in podcast with id 1',
            );
          });
      });
    });

    describe('deleteEpisode', () => {
      it('should delete a episode', () => {
        return privateTest(`mutation {
          deleteEpisode(input: {
            podcastId: ${TEST_PODCAST.id}
            episodeId: ${TEST_EPISODE.id}
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error } = res.body.data.deleteEpisode;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });

      it('should fail not find a episode', () => {
        return privateTest(`mutation {
          deleteEpisode(input: {
            podcastId: ${TEST_PODCAST.id}
            episodeId: ${TEST_EPISODE.id}
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error } = res.body.data.deleteEpisode;
            expect(ok).toBe(false);
            expect(error).toBe(
              `Episode with id ${TEST_EPISODE.id} not found in podcast with id ${TEST_PODCAST.id}`,
            );
          });
      });
    });

    describe('deletePodcast', () => {
      it('should delete a podcast', () => {
        return privateTest(`mutation {
          deletePodcast(input: {
            id: ${TEST_PODCAST.id}
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error } = res.body.data.deletePodcast;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });

      it('should fail if not find a podcast', () => {
        return privateTest(`mutation {
          deletePodcast(input: {
            id: ${TEST_PODCAST.id}
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect(res => {
            const { ok, error } = res.body.data.deletePodcast;
            expect(ok).toBe(false);
            expect(error).toBe(`Podcast with id ${TEST_PODCAST.id} not found`);
          });
      });
    });
  });
});
